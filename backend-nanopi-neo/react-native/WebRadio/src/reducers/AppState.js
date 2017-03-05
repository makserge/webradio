import {
  SELECT_WEBRADIO
} from '../constants/ActionTypes';

const initialState = {
  selectedWebradioId: 1
};

export default function State(state = initialState, action) {
  switch (action.type) {
    case SELECT_WEBRADIO:
      return {
        ...state,
        selectedWebradioId: action.payload
      };

    default:
      return state;
  }
}
