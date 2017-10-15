import {
  ADD_FMRADIO,
  DELETE_FMRADIO,
  EDIT_FMRADIO,
  SELECT_FMRADIO,
  SORT_FMRADIO
} from '../constants/ActionTypes';

export * from './AppState';

export const addItem = payload => ({
  type: ADD_FMRADIO,
  payload
});

export const deleteItem = payload => ({
  type: DELETE_FMRADIO,
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

export const sortItem = payload => ({
  type: SORT_FMRADIO,
  payload
});
