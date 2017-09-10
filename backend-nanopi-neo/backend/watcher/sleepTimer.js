import config from '../config';
import constants from '../constants';

import serialController from '../controller/serialController';

const SLEEP_TIMER_DELAY = 60 * 1000;
let sleepTimerInterval;

const sendSleepTimerInfo = (socket, remaining) => {
  if (socket.connections.size) {
    const data = {
      remaining
    };
    console.log(constants.socketSleepTimer, data)
    socket.broadcast(constants.socketSleepTimer, data);
    serialController.sendSleepTimer(remaining);
  }
}

const onSleepTimerFinished = async(db) => {
  console.log('onSleepTimerFinished');
  let appState = { madeBy: 'dbWatcher' };
  try {
    const doc = await db.getDocument(config.couchDbName, constants.dbDocumentAppState);
    if (doc.data[constants.dbFieldState]) {
      appState._rev = doc.data._rev;
      appState[constants.dbFieldState] = doc.data[constants.dbFieldState];
    }
    appState[constants.dbFieldState][constants.dbStatusSleepTimerOn] = false;
    appState[constants.dbFieldState][constants.dbStatusPower] = false;
    await db.createDocument(config.couchDbName, appState, constants.dbDocumentAppState);
  }
  catch(e) {
  }
}

const sleepTimer = {
  start(enabled, value, socket, db) {
    if (sleepTimerInterval) {
      clearInterval(sleepTimerInterval);
    }
    if (enabled) {
      let timeout = value;
      sendSleepTimerInfo(socket, timeout);
      sleepTimerInterval = setInterval(() => {
        timeout--;
        sendSleepTimerInfo(socket, timeout);
        if (timeout === 0) {
          clearInterval(sleepTimerInterval);
          onSleepTimerFinished(db);
        }
      }, SLEEP_TIMER_DELAY);
    } else {
      sendSleepTimerInfo(socket, 0);
    }
  },

  async set(db, enabled) {
    let appState = { madeBy: 'dbWatcher' };
    try {
      const doc = await db.getDocument(config.couchDbName, constants.dbDocumentAppState);
      if (doc.data[constants.dbFieldState]) {
        appState._rev = doc.data._rev;
        appState[constants.dbFieldState] = doc.data[constants.dbFieldState];
      }
      appState[constants.dbFieldState][constants.dbStatusSleepTimerOn] = enabled;
      await db.createDocument(config.couchDbName, appState, constants.dbDocumentAppState);
    }
    catch(e) {
      console.log(e);
    }
  }
};

export default sleepTimer;
