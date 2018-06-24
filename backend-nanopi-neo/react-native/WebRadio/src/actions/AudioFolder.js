import {
  SELECT_AUDIO_FOLDER,
} from '../constants/ActionTypes';

export const selectFolder = payload => ({
  type: SELECT_AUDIO_FOLDER,
  payload,
});
