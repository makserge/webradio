import {
  ADD_DAB_RADIO,
  DELETE_DAB_RADIO,
  EDIT_DAB_RADIO,
  SORT_DAB_RADIO,
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

const DabRadio = (state = initialState, action) => {
  switch (action.type) {
    case ADD_DAB_RADIO:
      return [
        ...state,
        {
          id: state.reduce((maxId, item) => Math.max(item.id, maxId), 0) + 1,
          title: action.payload.title,
          value: action.payload.value,
        },
      ];

    case DELETE_DAB_RADIO:
      return state.filter(item => item.id !== action.payload);

    case EDIT_DAB_RADIO: {
      const { id, title, value } = action.payload;
      return state.map(item => (item.id === id ? Object.assign({}, item, { title, value }) : item));
    }

    case SORT_DAB_RADIO:
      return arrayMove(state, action.payload.oldIndex, action.payload.newIndex);

    default:
      return state;
  }
};

export default persistentReducer(DabRadio);
