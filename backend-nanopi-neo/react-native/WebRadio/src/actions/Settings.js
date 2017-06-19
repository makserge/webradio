import {
  SET_SLEEP_TIMER,
  SET_ALARM,
} from '../constants/ActionTypes';

export * from './AppState';

export const setSleepTimer = payload => ({
  type: SET_SLEEP_TIMER,
  payload
});

export const setAlarm = (alarm, data) => ({
  type: SET_ALARM,
  payload: { alarm, data }
});
