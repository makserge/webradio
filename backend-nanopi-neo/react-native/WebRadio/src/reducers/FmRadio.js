import {
  ADD_FM_RADIO,
  DELETE_FM_RADIO,
  EDIT_FM_RADIO,
  SORT_FM_RADIO,
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
    case ADD_FM_RADIO:
      return [
        ...state,
        {
          id: state.reduce((maxId, item) => Math.max(item.id, maxId), 0) + 1,
          title: action.payload.title,
          value: action.payload.value,
        },
      ];

    case DELETE_FM_RADIO:
      return state.filter(item => item.id !== action.payload);

    case EDIT_FM_RADIO: {
      const { id, title, value } = action.payload;
      return state.map(item => (item.id === id ? Object.assign({}, item, { title, value }) : item));
    }

    case SORT_FM_RADIO:
      return arrayMove(state, action.payload.oldIndex, action.payload.newIndex);

    default:
      return state;
  }
};

export default persistentReducer(FmRadio);
