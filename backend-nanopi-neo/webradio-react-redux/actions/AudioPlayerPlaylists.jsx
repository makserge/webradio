import * as types from '../constants/ActionTypes';

export function addItem(text, value) {
  return { type: types.ADD_AUDIO_PLAYLIST, text, value };
}

export function deleteItem(id) {
  return { type: types.DELETE_AUDIO_PLAYLIST, id };
}

export function editItem(id, title, value) {
  return { type: types.EDIT_AUDIO_PLAYLIST, id, title, value };
}

export function playItem(id) {
  return { type: types.PLAY_AUDIO_PLAYLIST, id };
}

export function reorderItem(oldIndex, newIndex) {
  return { type: types.REORDER_AUDIO_PLAYLIST, oldIndex, newIndex };
}

export function stopItem() {
  return { type: types.STOP__AUDIO_PLAYLIST };
}
