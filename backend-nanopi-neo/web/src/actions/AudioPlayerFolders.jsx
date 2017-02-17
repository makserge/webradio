import * as types from '../constants/ActionTypes';

export function addFolderToPlaylist(id, playlistId) {
  return { type: types.ADD_AUDIO_FOLDER_TO_PLAYLIST, id, playlistId };
}

export function addTrackToPlaylist(id, playlistId) {
  return { type: types.ADD_AUDIO_TRACK_TO_PLAYLIST, id, playlistId };
}

export function deleteFolder(id) {
  return { type: types.DELETE_AUDIO_FOLDER, id };
}

export function deleteTrack(id) {
  return { type: types.DELETE_AUDIO_TRACK, id };
}

export function playFolder(id) {
  return { type: types.PLAY_AUDIO_FOLDER, id };
}

export function playTrack(id) {
  return { type: types.PLAY_AUDIO_TRACK, id };
}
