import {
  ADD_AUDIO_PLAYLIST,
  DELETE_AUDIO_PLAYLIST,
  EDIT_AUDIO_PLAYLIST,
  SELECT_AUDIO_PLAYLIST,
  SORT_AUDIO_PLAYLIST
} from '../constants/ActionTypes';

export * from './AppState';

export const addItem = payload => ({
  type: ADD_AUDIO_PLAYLIST,
  payload
});

export const deleteItem = payload => ({
  type: DELETE_AUDIO_PLAYLIST,
  payload
});

export const editItem = payload => ({
  type: EDIT_AUDIO_PLAYLIST,
  payload
});

export const selectItem = payload => ({
  type: SELECT_AUDIO_PLAYLIST,
  payload
});

export const sortItem = payload => ({
  type: SORT_AUDIO_PLAYLIST,
  payload
});
