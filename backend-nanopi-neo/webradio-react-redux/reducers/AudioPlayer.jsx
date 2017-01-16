import { ADD_AUDIO_PLAYLIST, DELETE_AUDIO_PLAYLIST, EDIT_AUDIO_PLAYLIST, REORDER_AUDIO_PLAYLIST, PLAY_AUDIO_PLAYLIST, STOP_AUDIO_PLAYLIST } from '../constants/ActionTypes';
import { arrayMove } from 'react-sortable-hoc';

const initialState = [{
  id: 1,
  title: 'Playlist 1',
  value: "Tracks: 19",
  selected: true
},
{
  id: 2,
  title: 'Playlist 2',
  value: "Tracks: 145",
  selected: false
},
{
  id: 3,
  title: 'Playlist 3',
  value: "Tracks: 0",
  selected: false
}];

export default function AudioPlayer(state = initialState, action) {
  switch (action.type) {
  case ADD_AUDIO_PLAYLIST:
    return [{
      id: state.reduce((maxId, item) => Math.max(item.id, maxId), -1) + 1,
      title: action.title,
      value: action.value
    }, ...state];

  case DELETE_AUDIO_PLAYLIST:
    return state.filter(item =>
      item.id !== action.id
    );

  case EDIT_AUDIO_PLAYLIST:
    return state.map(item =>
      item.id === action.id ?
        Object.assign({}, item, { title: action.title, value: action.value }) :
        item
    );

  case REORDER_AUDIO_PLAYLIST:
    return arrayMove(state, action.oldIndex, action.newIndex);

  case PLAY_AUDIO_PLAYLIST:
    return state.map(item =>
      item.id === action.id ?
        Object.assign({}, item, { selected: true }) :
        Object.assign({}, item, { selected: false })
    );

  case STOP_AUDIO_PLAYLIST:
    return state.map(item =>
        Object.assign({}, item, { selected: false })
    );

  default:
    return state;
  }
}
