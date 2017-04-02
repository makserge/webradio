import {
  ADD_FMRADIO,
  DELETE_FMRADIO,
  EDIT_FMRADIO,
  SORT_FMRADIO,
  STOP_FMRADIO
} from '../constants/ActionTypes';

const initialState = [{
  id: 1,
  title: 'Preset 1',
  value: '98.0',
},
{
  id: 2,
  title: 'Preset 2',
  value: '101.2',
},
{
  id: 3,
  title: 'Preset 3',
  value: '105.1',
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

export default function FmRadio(state = initialState, action) {
  switch (action.type) {
    case ADD_FMRADIO:
      return [
        {
        id: state.reduce((maxId, item) => Math.max(item.id, maxId), -1) + 1,
          title: action.payload.title,
          value: action.payload.value
        },
        ...state
      ];

      case DELETE_FMRADIO:
        return state.filter(item =>
          item.id !== action.payload
        );

      case EDIT_FMRADIO: {
        const { id, title, value } = action.payload;
        return state.map(item =>
          (item.id === id ? Object.assign({}, item, { title, value }) : item));
      }

      case SORT_FMRADIO:
        return arrayMove(state, action.payload.oldIndex, action.payload.newIndex);

      case STOP_FMRADIO:
        return state.map(item =>
          Object.assign({}, item, { selected: false })
        );

      default:
        return state;
    }
}
