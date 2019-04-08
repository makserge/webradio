import {
  DEFAULT_MODE,
  GET_MODE,
  TOGGLE_POWER,
  TOGGLE_SLEEP_TIMER,
  SET_VOLUME,
  TOGGLE_VOLUME_MUTE,
  SELECT_WEBRADIO,
  SELECT_RADIO,
  SELECT_AUDIO_PLAYLIST,
  PLAY_PREVIOUS_AUDIO_TRACK,
  PLAY_NEXT_AUDIO_TRACK,
  TOGGLE_AUDIO_PLAYER_SHUFFLE,
  TOGGLE_AUDIO_PLAYER_PLAY,
  PLAY_AUDIO_TRACK,
  SET_SLEEP_TIMER,
  SELECT_AUDIO_TAB,
  SELECT_AUDIO_FOLDER,
  RESCAN_AUDIO_FOLDERS,
} from '../constants/ActionTypes';
import { persistentReducer } from '../store/redux-pouchdb';

const initialState = {
  mode: DEFAULT_MODE,
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
  audioPlayerShuffle: true,
  audioPlayerPlay: true,
  sleepTimer: 60,
  rescanAudioFolders: false,
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
    case SELECT_RADIO:
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
    case PLAY_PREVIOUS_AUDIO_TRACK:
      if (state.mode === DEFAULT_MODE) {
        return {
          ...state,
          selectedWebRadioId: state.selectedWebRadioId - 1,
        };
      }
      return {
        ...state,
        selectedAudioTrackId: state.selectedAudioTrackId - 1,
      };
    case PLAY_NEXT_AUDIO_TRACK:
      if (state.mode === DEFAULT_MODE) {
        return {
          ...state,
          selectedWebRadioId: state.selectedWebRadioId + 1,
        };
      }
      return {
        ...state,
        selectedAudioTrackId: state.selectedAudioTrackId + 1,
      };
    case TOGGLE_AUDIO_PLAYER_SHUFFLE:
      return {
        ...state,
        audioPlayerShuffle: !state.audioPlayerShuffle,
      };
    case TOGGLE_AUDIO_PLAYER_PLAY:
      return {
        ...state,
        audioPlayerPlay: !state.audioPlayerPlay,
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
    case RESCAN_AUDIO_FOLDERS:
      return {
        ...state,
        rescanAudioFolders: true,
      };
    default:
      return state;
  }
};

export default persistentReducer(AppState);
