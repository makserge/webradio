import { ADD_FMPRESET, DELETE_FMPRESET, EDIT_FMPRESET, REORDER_FMPRESET, PLAY_FMPRESET, STOP_FMPRESET } from '../constants/ActionTypes';
import { arrayMove } from 'react-sortable-hoc';

const initialState = [{
  id: 1,
  title: 'Preset 1',
  value: "88.0",
  selected: true
},
{
  id: 2,
  title: 'Preset 2',
  value: "100.0",
  selected: false
},
{
  id: 3,
  title: 'Preset 3',
  value: "102.0",
  selected: false
}];

export default function FmRadio(state = initialState, action) {
  switch (action.type) {
  case ADD_FMPRESET:
    return [{
      id: state.reduce((maxId, item) => Math.max(item.id, maxId), -1) + 1,
      title: action.title,
      value: action.value
    }, ...state];

  case DELETE_FMPRESET:
    return state.filter(item =>
      item.id !== action.id
    );

  case EDIT_FMPRESET:
    return state.map(item =>
      item.id === action.id ?
        Object.assign({}, item, { title: action.title, value: action.value }) :
        item
    );

  case REORDER_FMPRESET:
    return arrayMove(state, action.oldIndex, action.newIndex);

  case PLAY_FMPRESET:
    return state.map(item =>
      item.id === action.id ?
        Object.assign({}, item, { selected: true }) :
        Object.assign({}, item, { selected: false })
    );

  case STOP_FMPRESET:
    return state.map(item =>
        Object.assign({}, item, { selected: false })
    );

  default:
    return state;
  }
}
