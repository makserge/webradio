import * as types from '../constants/ActionTypes';

export function addTodo(text) {
  return { type: types.ADD_WEBRADIO, text };
}

export function deleteItem(id) {
  return { type: types.DELETE_WEBRADIO, id };
}

export function editItem(id, title, value) {
  return { type: types.EDIT_WEBRADIO, id, title, value };
}

export function playItem(id) {
  return { type: types.MOVE_WEBRADIO, id };
}

export function completeAll() {
  return { type: types.PLAY_WEBRADIO };
}

export function clearCompleted() {
  return { type: types.STOP_WEBRADIO };
}
