import {
  TOGGLE_POWER,
  TOGGLE_SLEEP_TIMER,
  SET_VOLUME,
  TOGGLE_VOLUME_MUTE
} from '../constants/ActionTypes';

export const togglePower = payload => ({
  type: TOGGLE_POWER,
  payload
});

export const toggleSleepTimer = payload => ({
  type: TOGGLE_SLEEP_TIMER,
  payload
});

export const setVolume = payload => ({
  type: SET_VOLUME,
  payload
});

export const toggleVolumeMute = () => ({
  type: TOGGLE_VOLUME_MUTE
});
