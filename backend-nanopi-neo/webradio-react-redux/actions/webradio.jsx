import * as types from '../constants/ActionTypes';

export function addItem(title, value) {
  return { type: types.ADD_WEBRADIO, title, value };
}

export function deleteItem(id) {
  return { type: types.DELETE_WEBRADIO, id };
}

export function editItem(id, title, value) {
  return { type: types.EDIT_WEBRADIO, id, title, value };
}

export function playItem(id) {
  return { type: types.PLAY_WEBRADIO, id };
}

export function reorderItem(oldIndex, newIndex) {
  return { type: types.REORDER_WEBRADIO, oldIndex, newIndex };
}

export function stopItem() {
  return { type: types.STOP_WEBRADIO };
}
