import { ADD_WEBRADIO, DELETE_WEBRADIO, EDIT_WEBRADIO, MOVE_WEBRADIO, PLAY_WEBRADIO, STOP_WEBRADIO } from '../constants/ActionTypes';

const initialState = [{
  title: 'Stream 1',
  url: "http://dfsfsdf",
  id: 1
},
{
  title: 'Stream 2',
  url: "http://dfsfsdfdfsdf",
  id: 2
},
{
  title: 'Stream 3',
  url: "http://dfsadfsfssfsdf",
  id: 3
}];

export default function webradio(state = initialState, action) {
  switch (action.type) {
  case ADD_WEBRADIO:
    return [{
      id: state.reduce((maxId, item) => Math.max(item.id, maxId), -1) + 1,
      url: "",
      text: action.text
    }, ...state];

  case DELETE_WEBRADIO:
    return state.filter(item =>
      item.id !== action.id
    );

  case EDIT_WEBRADIO:
    return state.map(item =>
      item.id === action.id ?
        Object.assign({}, item, { text: action.text }) :
        item
    );

  case MOVE_WEBRADIO:
    return state.map(item =>
      item.id === action.id ?
        Object.assign({}, item, { url: "" }) :
        item
    );

  case PLAY_WEBRADIO:
    return state.map(item => Object.assign({}, item, {
      url: ""
    }));

  case STOP_WEBRADIO:
    return state.filter(item => url = "");

  default:
    return state;
  }
}
