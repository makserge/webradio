import config from '../config';
import constants from '../constants';

import serialController from '../controller/serialController';
import { setPower, setAppStateField } from '../watcher/utils';

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
  await setAppStateField(db, constants.dbStatusSleepTimerOn, false);
  setPower(db, false);
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
    setAppStateField(db, constants.dbStatusSleepTimerOn, enabled);
  }
};

export default sleepTimer;
