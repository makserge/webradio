import {
  ADD_FMRADIO,
  DELETE_FMRADIO,
  EDIT_MODE_FMRADIO,
  EDIT_FMRADIO,
  SELECT_FMRADIO,
  SORT_MODE_FMRADIO,
  SORT_FMRADIO,
  STOP_FMRADIO
} from '../constants/ActionTypes';

export const addItem = payload => ({
  type: ADD_FMRADIO,
  payload
});

export const deleteItem = payload => ({
  type: DELETE_FMRADIO,
  payload
});

export const editItemMode = payload => ({
  type: EDIT_MODE_FMRADIO,
  payload
});

export const editItem = payload => ({
  type: EDIT_FMRADIO,
  payload
});

export const selectItem = payload => ({
  type: SELECT_FMRADIO,
  payload
});

export const sortItemMode = payload => ({
  type: SORT_MODE_FMRADIO,
  payload
});

export const sortItem = payload => ({
  type: SORT_FMRADIO,
  payload
});

export const stopItem = payload => ({
  type: STOP_FMRADIO,
  payload
});
