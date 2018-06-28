import {
  SELECT_AUDIO_FOLDER,
  RESCAN_AUDIO_FOLDERS,
} from '../constants/ActionTypes';

export const selectFolder = payload => ({
  type: SELECT_AUDIO_FOLDER,
  payload,
});

export const rescanFolders = payload => ({
  type: RESCAN_AUDIO_FOLDERS,
  payload,
});
