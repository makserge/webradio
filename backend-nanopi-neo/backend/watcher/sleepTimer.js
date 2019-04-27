import constants from '../constants';

import {
  setPower,
  setAppStateField,
  sendLog,
} from './utils';

const SLEEP_TIMER_DELAY = 60 * 1000;
let sleepTimerInterval;

const sendSleepTimerInfo = (socket, serialController, remaining) => {
  if (socket.connections.size) {
    const data = {
      remaining,
    };
    sendLog('sendSleepTimerInfo()', `${constants.socketSleepTimer} ${data}`);
    socket.broadcast(constants.socketSleepTimer, data);
    serialController.sendSleepTimerTime(remaining);
  }
};

async function onSleepTimerFinished(db) {
  sendLog('onSleepTimerFinished()');
  await setAppStateField(db, constants.dbStatusSleepTimerOn, false);
  await setPower(db, false);
}

const sleepTimer = {
  start(enabled, value, socket, serialController, db) {
    if (sleepTimerInterval) {
      clearInterval(sleepTimerInterval);
    }
    if (enabled) {
      let timeout = value;
      sendSleepTimerInfo(socket, serialController, timeout);
      sleepTimerInterval = setInterval(() => {
        timeout--;
        sendSleepTimerInfo(socket, serialController, timeout);
        if (timeout === 0) {
          clearInterval(sleepTimerInterval);
          onSleepTimerFinished(db);
        }
      }, SLEEP_TIMER_DELAY);
    } else {
      sendSleepTimerInfo(socket, serialController, 0);
    }
  },

  async set(db, serialController, enabled) {
    await setAppStateField(db, constants.dbStatusSleepTimerOn, enabled);
    serialController.sendSleepTimer(enabled);
  },
};

export default sleepTimer;
