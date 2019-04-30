import {
  ADD_AUDIO_PLAYLIST,
  DELETE_AUDIO_PLAYLIST,
  EDIT_AUDIO_PLAYLIST,
  SORT_AUDIO_PLAYLIST,
} from '../constants/ActionTypes';
import { persistentReducer } from '../store/redux-pouchdb';

const initialState = [];

const arrayMove = (arr, previousIndex, newIndex) => {
  const array = arr.slice(0);
  if (newIndex >= array.length) {
    let k = newIndex - array.length;
    while (k-- + 1) {
      array.push(undefined);
    }
  }
  array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);
  return array;
};

const AudioPlaylist = (state = initialState, action) => {
  switch (action.type) {
    case ADD_AUDIO_PLAYLIST:
      return [
        ...state,
        {
          id: state.reduce((maxId, item) => Math.max(item.id, maxId), 0) + 1,
          title: action.payload.title,
          folders: action.payload.folders,
          tracksCount: 0,
          isUpdating: true,
        },
      ];

    case DELETE_AUDIO_PLAYLIST:
      return state.filter(item => item.id !== action.payload);

    case EDIT_AUDIO_PLAYLIST: {
      const { id, title, folders } = action.payload;
      return state.map((item) => {
        if (item.id === id) {
          return {
            id: item.id,
            title,
            folders,
            tracksCount: 0,
            isUpdating: JSON.stringify(folders) !== JSON.stringify(item.folders),
          };
        }
        return item;
      });
    }
    case SORT_AUDIO_PLAYLIST:
      return arrayMove(state, action.payload.oldIndex, action.payload.newIndex);

    default:
      return state;
  }
};
export default persistentReducer(AudioPlaylist);
