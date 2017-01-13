import * as types from '../constants/ActionTypes';

export function addItem(title, value) {
  return { type: types.ADD_FMPRESET, title, value };
}

export function deleteItem(id) {
  return { type: types.DELETE_FMPRESET, id };
}

export function editItem(id, title, value) {
  return { type: types.EDIT_FMPRESET, id, title, value };
}

export function playItem(id) {
  return { type: types.PLAY_FMPRESET, id };
}

export function reorderItem(oldIndex, newIndex) {
  return { type: types.REORDER_FMPRESET, oldIndex, newIndex };
}

export function stopItem() {
  return { type: types.STOP_FMPRESET };
}
