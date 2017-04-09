import {
  ADD_AUDIO_PLAYLIST,
  DELETE_AUDIO_PLAYLIST,
  EDIT_AUDIO_PLAYLIST,
  SORT_AUDIO_PLAYLIST
} from '../constants/ActionTypes';

const initialState = [{
  id: 1,
  title: 'Playlist 1',
  value: '/folder1',
},
{
  id: 2,
  title: 'Playlist 2',
  value: '/folder2',
},
{
  id: 3,
  title: 'Playlist 3',
  value: '/folder3',
}];

function arrayMove(arr, previousIndex, newIndex) {
  const array = arr.slice(0);
  if (newIndex >= array.length) {
    let k = newIndex - array.length;
    while (k-- + 1) {
      array.push(undefined);
    }
  }
  array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);
  return array;
}

export default function AudioPlaylist(state = initialState, action) {
  switch (action.type) {
    case ADD_AUDIO_PLAYLIST:
      return [
        {
        id: state.reduce((maxId, item) => Math.max(item.id, maxId), -1) + 1,
          title: action.payload.title,
          value: action.payload.value
        },
        ...state
      ];

      case DELETE_AUDIO_PLAYLIST:
        return state.filter(item =>
          item.id !== action.payload
        );

      case EDIT_AUDIO_PLAYLIST: {
        const { id, title, value } = action.payload;
        return state.map(item =>
          (item.id === id ? Object.assign({}, item, { title, value }) : item));
      }

      case SORT_AUDIO_PLAYLIST:
        return arrayMove(state, action.payload.oldIndex, action.payload.newIndex);

      default:
        return state;
    }
}
