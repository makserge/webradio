import constants from '../constants';
import {
  getState,
  getMode,
  sendLog,
} from './utils';

async function getCount(db, document) {
  try {
    const doc = await db.get(document);
    if (doc[constants.dbFieldState]) {
      const state = doc[constants.dbFieldState];
      return state.length;
    }
  } catch (e) {
    sendLog('getCount()', e);
  }
}

const getAlarms = (db) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await db.get(constants.dbDocumentAlarm);
      const result = [];
      if (doc[constants.dbFieldState]) {
        const alarmState = doc[constants.dbFieldState];
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

export default async function (db, serialController) {
  const state = await getState(db);
  let alarms;
  try {
    alarms = await getAlarms(db);
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
    await getCount(db, constants.dbDocumentWebRadio),
    await getCount(db, constants.dbDocumentFmRadio),
    await getCount(db, constants.dbDocumentDabRadio),
    await getCount(db, constants.dbDocumentAudioTrack),
    await getMode(db),
    state[constants.dbStatusPower],
    state[constants.dbStatusVolume],
    state[constants.dbStatusVolumeMute],
    state[constants.dbStatusSleepTimer],
    state[constants.dbStatusSleepTimerOn],
  ];
  serialController.sendStatus([...status, ...alarms]);
}
