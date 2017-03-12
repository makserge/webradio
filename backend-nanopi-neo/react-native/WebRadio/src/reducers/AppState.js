import {
  SELECT_WEBRADIO,
  REORDER_MODE_WEBRADIO,
  REORDER_WEBRADIO
} from '../constants/ActionTypes';

const initialState = {
  selectedWebradioId: 1,
  sortWebradio: false
};

export default function State(state = initialState, action) {
  switch (action.type) {
    case SELECT_WEBRADIO:
      return {
        ...state,
        selectedWebradioId: action.payload
      };
    case REORDER_MODE_WEBRADIO:
      return {
        ...state,
        sortWebradio: true
      };
    case REORDER_WEBRADIO:
      return {
        ...state,
        sortWebradio: false
      };
    default:
      return state;
  }
}
