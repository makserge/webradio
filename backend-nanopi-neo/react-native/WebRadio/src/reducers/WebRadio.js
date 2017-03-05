import {
  ADD_WEBRADIO,
  DELETE_WEBRADIO,
  EDIT_WEBRADIO,
  REORDER_WEBRADIO,
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

export default function WebRadio(state = initialState, action) {
  switch (action.type) {
    case ADD_WEBRADIO:
      return [{
        id: state.reduce((maxId, item) => Math.max(item.id, maxId), -1) + 1,
        title: action.title,
        value: action.value
      }, ...state];

      case DELETE_WEBRADIO:
        return state.filter(item =>
          item.id !== action.id
      );

      case EDIT_WEBRADIO:
        return state;
    //return state.map(item =>
    //  item.id === action.id ?
    //    Object.assign({}, item, { title: action.title, value: action.value }) :
    //    item
    //);

      case REORDER_WEBRADIO:
    //return arrayMove(state, action.oldIndex, action.newIndex);
        return state;

      case STOP_WEBRADIO:
        return state.map(item =>
          Object.assign({}, item, { selected: false })
        );

      default:
        return state;
    }
  }
