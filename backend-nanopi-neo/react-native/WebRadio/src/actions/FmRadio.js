import {
  ADD_FM_RADIO,
  DELETE_FM_RADIO,
  EDIT_FM_RADIO,
  SELECT_FM_RADIO,
  SORT_FM_RADIO,
  SEEK_UP_FM_RADIO,
  CANCEL_SEEK_UP_FM_RADIO,
  SEEK_DOWN_FM_RADIO,
  CANCEL_SEEK_DOWN_FM_RADIO,
} from '../constants/ActionTypes';

export * from './AppState';

export const addItem = payload => ({
  type: ADD_FM_RADIO,
  payload,
});

export const deleteItem = payload => ({
  type: DELETE_FM_RADIO,
  payload,
});

export const editItem = payload => ({
  type: EDIT_FM_RADIO,
  payload,
});

export const selectItem = payload => ({
  type: SELECT_FM_RADIO,
  payload,
});

export const sortItem = payload => ({
  type: SORT_FM_RADIO,
  payload,
});

export const seekUp = payload => ({
  type: SEEK_UP_FM_RADIO,
  payload,
});

export const cancelSeekUp = payload => ({
  type: CANCEL_SEEK_UP_FM_RADIO,
  payload,
});

export const seekDown = payload => ({
  type: SEEK_DOWN_FM_RADIO,
  payload,
});

export const cancelSeekDown = payload => ({
  type: CANCEL_SEEK_DOWN_FM_RADIO,
  payload,
});
