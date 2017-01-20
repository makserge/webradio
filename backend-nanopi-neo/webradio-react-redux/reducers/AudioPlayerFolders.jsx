import { ADD_AUDIO_FOLDER_TO_PLAYLIST, ADD_AUDIO_TRACK_TO_PLAYLIST, DELETE_AUDIO_FOLDER, DELETE_AUDIO_TRACK, PLAY_AUDIO_FOLDER, PLAY_AUDIO_TRACK } from '../constants/ActionTypes';

const initialState = [
{
  id: 1,
  primaryText: 'Folder 1',
  type: 'folder',
  tracks: '2',
  children: [
    {
      id: 2,
      primaryText: 'SubFolder 1',
      type: 'folder',
      tracks: '2',
      children: [
        {
          id: 3,
          primaryText: 'File 1',
          type: 'file',
          codec: 'MP3',
          bitrate: '320'
        },
        {
          id: 4,
          primaryText: 'File 2',
          type: 'file',
          codec: 'FLAC',
          bitrate: '1000'
        }
      ]
    }
  ]
}
];

export default function AudioPlayerFolders(state = initialState, action) {
  switch (action.type) {
  case ADD_AUDIO_FOLDER_TO_PLAYLIST:
    return [{
      id: action.id,
      playlistId: action.playlistId
    }, ...state];

  case ADD_AUDIO_TRACK_TO_PLAYLIST:
    return [{
      id: action.id,
      playlistId: action.playlistId
    }, ...state];

  case DELETE_AUDIO_FOLDER:
    return state.filter(item =>
      item.id !== action.id
    );

  case DELETE_AUDIO_TRACK:
    return state.filter(item =>
      item.id !== action.id
    );

  case PLAY_AUDIO_FOLDER:
    return state.map(item =>
      item.id === action.id ?
        Object.assign({}, item, { selected: true }) :
        Object.assign({}, item, { selected: false })
    );

  case PLAY_AUDIO_TRACK:
    return state.map(item =>
      item.id === action.id ?
        Object.assign({}, item, { selected: true }) :
        Object.assign({}, item, { selected: false })
    );

  default:
    return state;
  }
}
