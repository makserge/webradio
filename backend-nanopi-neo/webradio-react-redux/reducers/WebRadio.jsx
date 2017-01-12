import { ADD_WEBRADIO, DELETE_WEBRADIO, EDIT_WEBRADIO, REORDER_WEBRADIO, PLAY_WEBRADIO, STOP_WEBRADIO } from '../constants/ActionTypes';
import { arrayMove } from 'react-sortable-hoc';

const initialState = [{
  id: 1,
  title: 'Stream 1',
  url: "http://dfsfsdf",
  selected: true
},
{
  id: 2,
  title: 'Stream 2',
  url: "http://dfsfsdfdfsdf",
  selected: false
},
{
  id: 3,
  title: 'Stream 3',
  url: "http://dfsadfsfssfsdf",
  selected: false
}];

export default function WebRadio(state = initialState, action) {
  switch (action.type) {
  case ADD_WEBRADIO:
    return [{
      id: state.reduce((maxId, item) => Math.max(item.id, maxId), -1) + 1,
      title: action.title,
      url: action.url
    }, ...state];

  case DELETE_WEBRADIO:
    return state.filter(item =>
      item.id !== action.id
    );

  case EDIT_WEBRADIO:
    return state.map(item =>
      item.id === action.id ?
        Object.assign({}, item, { title: action.title, url: action.url }) :
        item
    );

  case REORDER_WEBRADIO:
    return arrayMove(state, action.oldIndex, action.newIndex);

  case PLAY_WEBRADIO:
    return state.map(item =>
      item.id === action.id ?
        Object.assign({}, item, { selected: true }) :
        Object.assign({}, item, { selected: false })
    );

  case STOP_WEBRADIO:
    return state.map(item =>
        Object.assign({}, item, { selected: false })
    );

  default:
    return state;
  }
}
