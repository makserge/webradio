import {
  SELECT_WEBRADIO,
  SORT_MODE_WEBRADIO,
  SORT_WEBRADIO,
  EDIT_MODE_WEBRADIO,
  EDIT_WEBRADIO,
} from '../constants/ActionTypes';

const initialState = {
  selectedWebradioId: 1,
  sortWebradio: false,
  editWebRadio: false,
  editWebRadioId: 0,
};

export default function State(state = initialState, action) {
  switch (action.type) {
    case SELECT_WEBRADIO:
      return {
        ...state,
        selectedWebradioId: action.payload
      };
    case SORT_MODE_WEBRADIO:
      return {
        ...state,
        sortWebradio: true
      };
    case SORT_WEBRADIO:
      return {
        ...state,
        sortWebradio: false
      };
    case EDIT_MODE_WEBRADIO:
      return {
        ...state,
        editWebRadio: true,
        editWebRadioId: action.payload
      };
    case EDIT_WEBRADIO:
      return {
        ...state,
        editWebRadio: false
      };
    default:
      return state;
  }
}
