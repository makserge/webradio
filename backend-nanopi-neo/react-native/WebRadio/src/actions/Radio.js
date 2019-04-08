import {
  ADD_RADIO,
  DELETE_RADIO,
  EDIT_RADIO,
  SELECT_RADIO,
  SORT_RADIO,
} from '../constants/ActionTypes';

export * from './AppState';

export const addItem = payload => ({
  type: ADD_RADIO,
  payload,
});

export const deleteItem = payload => ({
  type: DELETE_RADIO,
  payload,
});

export const editItem = payload => ({
  type: EDIT_RADIO,
  payload,
});

export const selectItem = payload => ({
  type: SELECT_RADIO,
  payload,
});

export const sortItem = payload => ({
  type: SORT_RADIO,
  payload,
});
