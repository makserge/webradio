import constants from '../constants';

import serialController from '../controller/serialController';
import {
  setPower,
  setAppStateField,
  sendLog,
} from '../watcher/utils';

const SLEEP_TIMER_DELAY = 60 * 1000;
let sleepTimerInterval;

const sendSleepTimerInfo = (socket, serialPort, remaining) => {
  if (socket.connections.size) {
    const data = {
      remaining,
    };
    sendLog('sendSleepTimerInfo()', `${constants.socketSleepTimer} ${data}`);
    socket.broadcast(constants.socketSleepTimer, data);
    serialController.sendSleepTimerTime(serialPort, remaining);
  }
};

async function onSleepTimerFinished(db) {
  sendLog('onSleepTimerFinished()');
  await setAppStateField(db, constants.dbStatusSleepTimerOn, false);
  await setPower(db, false);
};

const sleepTimer = {
  start(enabled, value, socket, serialPort, db) {
    if (sleepTimerInterval) {
      clearInterval(sleepTimerInterval);
    }
    if (enabled) {
      let timeout = value;
      sendSleepTimerInfo(socket, serialPort, timeout);
      sleepTimerInterval = setInterval(() => {
        timeout--;
        sendSleepTimerInfo(socket, serialPort, timeout);
        if (timeout === 0) {
          clearInterval(sleepTimerInterval);
          onSleepTimerFinished(db);
        }
      }, SLEEP_TIMER_DELAY);
    } else {
      sendSleepTimerInfo(socket, serialPort, 0);
    }
  },

  async set(db, serialPort, enabled) {
    await setAppStateField(db, constants.dbStatusSleepTimerOn, enabled);
    serialController.sendSleepTimer(serialPort, enabled);
  },
};

export default sleepTimer;
