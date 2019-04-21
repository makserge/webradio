import {
  ADD_DAB_RADIO,
  DELETE_DAB_RADIO,
  EDIT_DAB_RADIO,
  SELECT_DAB_RADIO,
  SORT_DAB_RADIO,
  RESCAN_DAB_PRESETS,
  CANCEL_RESCAN_DAB_PRESETS,
} from '../constants/ActionTypes';

export * from './AppState';

export const addItem = payload => ({
  type: ADD_DAB_RADIO,
  payload,
});

export const deleteItem = payload => ({
  type: DELETE_DAB_RADIO,
  payload,
});

export const editItem = payload => ({
  type: EDIT_DAB_RADIO,
  payload,
});

export const selectItem = payload => ({
  type: SELECT_DAB_RADIO,
  payload,
});

export const sortItem = payload => ({
  type: SORT_DAB_RADIO,
  payload,
});

export const rescanPresets = payload => ({
  type: RESCAN_DAB_PRESETS,
  payload,
});

export const cancelRescanPresets = payload => ({
  type: CANCEL_RESCAN_DAB_PRESETS,
  payload,
});
