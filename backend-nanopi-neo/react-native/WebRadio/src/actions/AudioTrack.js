import {
  PLAY_AUDIO_TRACK,
} from '../constants/ActionTypes';

export const playItem = payload => ({
  type: PLAY_AUDIO_TRACK,
  payload,
});
