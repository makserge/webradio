import constants from '../constants';
import serialController from '../controller/serialController';
import {
  getState,
  getMode
} from './utils';

const ALARM1 = 1;
const ALARM2 = 2;

const sendStatus = async(db, dbName, serialPort) => {
  const mode = await getMode(db, dbName);
  await serialController.sendMode(serialPort, mode);

  const state = await getState(db, dbName);
  await serialController.sendPower(serialPort, state[constants.dbStatusPower]);
  await serialController.sendVolume(serialPort, state[constants.dbStatusVolume]);
  await serialController.sendVolumeMute(serialPort, state[constants.dbStatusVolumeMute]);
  await serialController.sendSleepTimer(serialPort, [state[constants.dbStatusSleepTimer], state[constants.dbStatusSleepTimerOn]]);

  const doc = await db.getDocument(dbName, constants.dbDocumentAlarm);
  if (doc.data[constants.dbFieldState]) {
    const state = doc.data[constants.dbFieldState];
    for (const item of state) {
      const serialValue = [
        item.hour,
        item.min,
        item.enabled
      ];
      if (item.id === ALARM1) {
        serialController.sendAlarm1(serialPort, serialValue);
      } else if (item.id === ALARM2) {
        serialController.sendAlarm2(serialPort, serialValue);
      }
    }
  }
}

const sendCount = async(db, dbName, serialPort, document, sendCallback) => {
  try {
    const doc = await db.getDocument(dbName, document);
    if (doc.data[constants.dbFieldState]) {
      let state = doc.data[constants.dbFieldState];
      sendCallback(serialPort, state.length);
    }
  } catch(e) {
      sendCallback(serialPort, 1);
  }
};

export default async(db, dbName, serialPort) => {
  serialController.sendTime(serialPort);

  await sendCount(db, dbName, serialPort, constants.dbDocumentWebRadio, serialController.sendWebCount);
  await sendCount(db, dbName, serialPort, constants.dbDocumentFmRadio, serialController.sendFmCount);
  await sendCount(db, dbName, serialPort, constants.dbDocumentAudioTrack, serialController.sendPlayerCount);

  serialController.sendLoadComplete(serialPort, 1);

  await sendStatus(db, dbName, serialPort);
}
