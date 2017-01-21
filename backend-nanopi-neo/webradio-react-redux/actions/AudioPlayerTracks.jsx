import * as types from '../constants/ActionTypes';

export function loadTracks(id) {
  return { type: types.LOAD_AUDIO_PLAYLIST_TRACK, id };
}

export function playItem(id) {
  return { type: types.PLAY_AUDIO_PLAYLIST_TRACK, id };
}

export function stopItem() {
  return { type: types.STOP_AUDIO_PLAYLIST_TRACK };
}
