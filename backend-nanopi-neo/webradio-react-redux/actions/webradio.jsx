import * as types from '../constants/ActionTypes';

export function addItem(title, url) {
  return { type: types.ADD_WEBRADIO, title, url };
}

export function deleteItem(id) {
  return { type: types.DELETE_WEBRADIO, id };
}

export function editItem(id, title, url) {
  return { type: types.EDIT_WEBRADIO, id, title, url };
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
