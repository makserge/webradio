import {
  ADD_WEBRADIO,
  DELETE_WEBRADIO,
  EDIT_WEBRADIO,
  SELECT_WEBRADIO,
  REORDER_MODE_WEBRADIO,
  REORDER_WEBRADIO,
  STOP_WEBRADIO
} from '../constants/ActionTypes';

export const addItem = payload => ({
  type: ADD_WEBRADIO,
    payload
});

export const deleteItem = payload => ({
  type: DELETE_WEBRADIO,
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

export const setSortMode = payload => ({
  type: REORDER_MODE_WEBRADIO,
    payload
});

export const reorderItem = payload => ({
  type: REORDER_WEBRADIO,
  payload
});

export const stopItem = payload => ({
  type: STOP_WEBRADIO,
  payload
});
