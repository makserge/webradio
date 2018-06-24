import {
  DEFAULT_ROUTE,
  GET_MODE,
  TOGGLE_POWER,
  TOGGLE_SLEEP_TIMER,
  SET_VOLUME,
  TOGGLE_VOLUME_MUTE,
  SELECT_WEBRADIO,
  SELECT_FMRADIO,
  SELECT_AUDIO_PLAYLIST,
  PLAY_AUDIO_TRACK,
  SET_SLEEP_TIMER,
  SELECT_AUDIO_TAB,
  SELECT_AUDIO_FOLDER,
} from '../constants/ActionTypes';
import { persistentReducer } from '../store/redux-pouchdb';

const initialState = {
  mode: DEFAULT_ROUTE,
  power: false,
  sleepTimerOn: false,
  volume: 10,
  volumeMute: false,
  selectedWebRadioId: 1,
  selectedFmRadioId: 1,
  selectedAudioTab: 'tracks',
  selectedAudioPlayListId: 1,
  selectedAudioTrackId: 0,
  selectedAudioFolder: '',
  sleepTimer: 60,
};

const AppState = (state = initialState, action) => {
  switch (action.type) {
    case GET_MODE:
      return {
        ...state,
        mode: action.payload,
      };
    case TOGGLE_POWER:
      return {
        ...state,
        power: !state.power,
      };
    case TOGGLE_SLEEP_TIMER:
      return {
        ...state,
        sleepTimerOn: !state.sleepTimerOn,
      };
    case SET_VOLUME:
      return {
        ...state,
        volume: action.payload,
      };
    case TOGGLE_VOLUME_MUTE:
      return {
        ...state,
        volumeMute: !state.volumeMute,
      };
    case SELECT_WEBRADIO:
      return {
        ...state,
        selectedWebRadioId: action.payload,
      };
    case SELECT_FMRADIO:
      return {
        ...state,
        selectedFmRadioId: action.payload,
      };
    case SELECT_AUDIO_TAB:
      return {
        ...state,
        selectedAudioTab: action.payload,
      };
    case SELECT_AUDIO_PLAYLIST:
      return {
        ...state,
        selectedAudioPlayListId: action.payload,
      };
    case SELECT_AUDIO_FOLDER:
      return {
        ...state,
        selectedAudioFolder: action.payload,
      };
    case PLAY_AUDIO_TRACK:
      return {
        ...state,
        selectedAudioTrackId: action.payload,
      };
    case SET_SLEEP_TIMER:
      return {
        ...state,
        sleepTimer: parseInt(action.payload, 10),
      };
    default:
      return state;
  }
};

export default persistentReducer(AppState);
