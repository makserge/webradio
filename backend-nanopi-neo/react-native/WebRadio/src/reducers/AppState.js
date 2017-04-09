import {
  SELECT_WEBRADIO,
  SORT_MODE_WEBRADIO,
  SORT_WEBRADIO,
  EDIT_MODE_WEBRADIO,
  EDIT_WEBRADIO,
  SELECT_FMRADIO,
  SORT_MODE_FMRADIO,
  SORT_FMRADIO,
  EDIT_MODE_FMRADIO,
  EDIT_FMRADIO,
  SELECT_AUDIO_PLAYLIST,
  SORT_MODE_AUDIO_PLAYLIST,
  SORT_AUDIO_PLAYLIST,
  EDIT_MODE_AUDIO_PLAYLIST,
  EDIT_AUDIO_PLAYLIST,
} from '../constants/ActionTypes';

const initialState = {
  selectedWebRadioId: 1,
  sortWebRadio: false,
  editWebRadio: false,
  editWebRadioId: 0,
  selectedFmRadioId: 1,
  sortFmRadio: false,
  editFmRadio: false,
  editFmRadioId: 0,
  selectedAudioPlayListId: 1,
  sortAudioPlayList: false,
  editAudioPlayList: false,
  editAudioPlayListId: 0,
};

export default function State(state = initialState, action) {
  switch (action.type) {
    case SELECT_WEBRADIO:
      return {
        ...state,
        selectedWebRadioId: action.payload
      };
    case SORT_MODE_WEBRADIO:
      return {
        ...state,
        sortWebRadio: true
      };
    case SORT_WEBRADIO:
      return {
        ...state,
        sortWebRadio: false
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
    case SELECT_FMRADIO:
      return {
        ...state,
        selectedFmRadioId: action.payload
      };
    case SORT_MODE_FMRADIO:
      return {
        ...state,
        sortFmRadio: true
      };
    case SORT_FMRADIO:
      return {
        ...state,
        sortFmRadio: false
      };
    case EDIT_MODE_FMRADIO:
      return {
        ...state,
        editFmRadio: true,
        editFmRadioId: action.payload
      };
    case EDIT_FMRADIO:
      return {
        ...state,
        editFmRadio: false
      };
    case SELECT_AUDIO_PLAYLIST:
      return {
        ...state,
        selectedAudioPlayListId: action.payload
      };
    case SORT_MODE_AUDIO_PLAYLIST:
      return {
        ...state,
        sortAudioPlayList: true
      };
    case SORT_AUDIO_PLAYLIST:
      return {
        ...state,
        sortAudioPlayList: false
      };
    case EDIT_MODE_AUDIO_PLAYLIST:
      return {
        ...state,
        editAudioPlayList: true,
        editAudioPlayListId: action.payload
      };
    case EDIT_AUDIO_PLAYLIST:
      return {
        ...state,
        editAudioPlayList: false
      };
    default:
      return state;
  }
}
