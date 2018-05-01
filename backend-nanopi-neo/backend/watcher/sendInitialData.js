import constants from '../constants';
import serialController from '../controller/serialController';
import {
  getState,
  getMode,
  sendLog,
} from './utils';

const getCount = async (db, dbName, document) => {
  try {
    const doc = await db.getDocument(dbName, document);
    if (doc.data[constants.dbFieldState]) {
      const state = doc.data[constants.dbFieldState];
      return state.length;
    }
  } catch (e) {
    sendLog('getCount()', e);
  }
};

const getAlarms = (db, dbName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await db.getDocument(dbName, constants.dbDocumentAlarm);
      const result = [];
      if (doc.data[constants.dbFieldState]) {
        const alarmState = doc.data[constants.dbFieldState];
        for (const item of alarmState) {
          result.push(parseInt(item.hour, 10));
          result.push(parseInt(item.min, 10));
          result.push(item.enabled);
        }
      }
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

export default async (db, dbName, serialPort) => {
  const state = await getState(db, dbName);
  let alarms;
  try {
    alarms = await getAlarms(db, dbName);
  } catch (e) {
    sendLog('getAlarms()', e);
    alarms = [0, 0, false, 0, 0, false];
  }

  const date = new Date();

  const status = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    await getCount(db, dbName, constants.dbDocumentWebRadio),
    await getCount(db, dbName, constants.dbDocumentFmRadio),
    await getCount(db, dbName, constants.dbDocumentAudioTrack),
    await getMode(db, dbName),
    state[constants.dbStatusPower],
    state[constants.dbStatusVolume],
    state[constants.dbStatusVolumeMute],
    state[constants.dbStatusSleepTimer],
    state[constants.dbStatusSleepTimerOn],
  ];

  serialController.sendStatus(serialPort, [...status, ...alarms]);
};
