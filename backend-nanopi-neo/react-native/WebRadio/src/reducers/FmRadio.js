import {
  ADD_FMRADIO,
  DELETE_FMRADIO,
  EDIT_FMRADIO,
  SORT_FMRADIO,
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

const FmRadio = (state = initialState, action) => {
  switch (action.type) {
    case ADD_FMRADIO:
      return [
        ...state,
        {
          id: state.reduce((maxId, item) => Math.max(item.id, maxId), 0) + 1,
          title: action.payload.title,
          value: action.payload.value,
        },
      ];

    case DELETE_FMRADIO:
      return state.filter(item => item.id !== action.payload);

    case EDIT_FMRADIO: {
      const { id, title, value } = action.payload;
      return state.map(item => (item.id === id ? Object.assign({}, item, { title, value }) : item));
    }

    case SORT_FMRADIO:
      return arrayMove(state, action.payload.oldIndex, action.payload.newIndex);

    default:
      return state;
  }
};

export default persistentReducer(FmRadio);
