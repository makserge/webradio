import { LOAD_AUDIO_PLAYLIST_TRACK, PLAY_AUDIO_PLAYLIST_TRACK, STOP_AUDIO_PLAYLIST_TRACK } from '../constants/ActionTypes';

const initialState = [
{
  id: 1,
  title: 'File 1',
  codec: 'MP3',
  bitrate: '320',
  selected: true
},
{
  id: 2,
  title: 'File 2',
  codec: 'FLAC',
  bitrate: '1000',
  selected: false
}];

export default function AudioPlayerTracks(state = initialState, action) {
  switch (action.type) {

  case LOAD_AUDIO_PLAYLIST_TRACK:
    return state.map(item =>
      Object.assign({}, item, { selected: false })
    );

  case PLAY_AUDIO_PLAYLIST_TRACK:
    return state.map(item =>
      item.id === action.id ?
        Object.assign({}, item, { selected: true }) :
        Object.assign({}, item, { selected: false })
    );

  case STOP_AUDIO_PLAYLIST_TRACK:
    return state.map(item =>
        Object.assign({}, item, { selected: false })
    );

  default:
    return state;
  }
}
