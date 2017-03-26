import {
  ADD_WEBRADIO,
  DELETE_WEBRADIO,
  EDIT_WEBRADIO,
  SORT_WEBRADIO,
  STOP_WEBRADIO
} from '../constants/ActionTypes';

const initialState = [{
  id: 1,
  title: 'Stream 1',
  value: 'http://dfsfsdf',
},
{
  id: 2,
  title: 'Stream 2',
  value: 'http://dfsfsdfdfsdf',
},
{
  id: 3,
  title: 'Stream 3',
  value: 'http://dfsadfsfssfsdf',
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

export default function WebRadio(state = initialState, action) {
  switch (action.type) {
    case ADD_WEBRADIO:
      return [
        {
        id: state.reduce((maxId, item) => Math.max(item.id, maxId), -1) + 1,
          title: action.payload.title,
          value: action.payload.value
        },
        ...state
      ];

      case DELETE_WEBRADIO:
        return state.filter(item =>
          item.id !== action.payload
        );

      case EDIT_WEBRADIO: {
        const { id, title, value } = action.payload;
        return state.map(item =>
          (item.id === id ? Object.assign({}, item, { title, value }) : item));
      }

      case SORT_WEBRADIO:
        return arrayMove(state, action.payload.oldIndex, action.payload.newIndex);

      case STOP_WEBRADIO:
        return state.map(item =>
          Object.assign({}, item, { selected: false })
        );

      default:
        return state;
    }
}
