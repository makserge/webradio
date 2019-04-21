import {
  ADD_FM_RADIO,
  DELETE_FM_RADIO,
  EDIT_FM_RADIO,
  SELECT_FM_RADIO,
  SORT_FM_RADIO,
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
