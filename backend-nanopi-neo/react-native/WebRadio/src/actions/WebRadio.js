import {
  ADD_WEBRADIO,
  DELETE_WEBRADIO,
  EDIT_MODE_WEBRADIO,
  EDIT_WEBRADIO,
  SELECT_WEBRADIO,
  SORT_MODE_WEBRADIO,
  SORT_WEBRADIO,
  STOP_WEBRADIO
} from '../constants/ActionTypes';

export * from './AppState';

export const addItem = payload => ({
  type: ADD_WEBRADIO,
  payload
});

export const deleteItem = payload => ({
  type: DELETE_WEBRADIO,
  payload
});

export const editItemMode = payload => ({
  type: EDIT_MODE_WEBRADIO,
  payload
});

export const editItem = payload => ({
  type: EDIT_WEBRADIO,
  payload
});

export const selectItem = payload => ({
  type: SELECT_WEBRADIO,
  payload
});

export const sortItemMode = payload => ({
  type: SORT_MODE_WEBRADIO,
  payload
});

export const sortItem = payload => ({
  type: SORT_WEBRADIO,
  payload
});

export const stopItem = payload => ({
  type: STOP_WEBRADIO,
  payload
});
