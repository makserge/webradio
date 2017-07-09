import {
  TOGGLE_POWER,
  TOGGLE_SLEEP_TIMER,
  SET_VOLUME,
  TOGGLE_VOLUME_MUTE,
  SELECT_WEBRADIO,
  SELECT_FMRADIO,
  SELECT_AUDIO_PLAYLIST,
  PLAY_AUDIO_TRACK,
  SET_SLEEP_TIMER,
  SET_ALARM,
  SELECT_AUDIO_TAB,
} from '../constants/ActionTypes';
import { persistentReducer } from '../store/redux-pouchdb';

const initialState = {
  power: false,
  sleepTimerOn: false,
  volume: 10,
  volumeMute: false,
  selectedWebRadioId: 1,
  selectedFmRadioId: 1,
  selectedAudioTab: 0,
  selectedAudioPlayListId: 1,
  selectedAudioTrackId: 0,
  sleepTimer: 60,
  alarms: [
  {
    id: 1,
    title: 'Alarm 1',
    enabled: true,
    time: '08:30',
    timeout: 60,
    days: [1, 2, 3, 4, 5],
    volume: 12,
    presetType: 'network',
    preset: 1,
  },
  {
    id: 2,
    title: 'Alarm 2',
    enabled: true,
    time: '09:00',
    timeout: 60,
    days: [6, 7],
    volume: 10,
    presetType: 'fm',
    preset: 2,
  }
  ]
};

const AppState = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_POWER:
      return {
        ...state,
        power: !state.power
      };
    case TOGGLE_SLEEP_TIMER:
      return {
        ...state,
        sleepTimerOn: !state.sleepTimerOn
      };
    case SET_VOLUME:
      return {
        ...state,
        volume: action.payload
      };
    case TOGGLE_VOLUME_MUTE:
      return {
        ...state,
        volumeMute: !state.volumeMute
      };
    case SELECT_WEBRADIO:
      return {
        ...state,
        selectedWebRadioId: action.payload
      };
    case SELECT_FMRADIO:
      return {
        ...state,
        selectedFmRadioId: action.payload
      };
    case SELECT_AUDIO_TAB:
      return {
        ...state,
        selectedAudioTab: action.payload
      };
    case SELECT_AUDIO_PLAYLIST:
      return {
        ...state,
        selectedAudioPlayListId: action.payload
      };
    case PLAY_AUDIO_TRACK:
      return {
        ...state,
        selectedAudioTrackId: action.payload
      };
    case SET_SLEEP_TIMER:
      return {
        ...state,
        sleepTimer: parseInt(action.payload, 10)
      };
    // eslint-disable-next-line no-case-declarations
    case SET_ALARM:
      const alarmsObject = { ...state.alarms };
      const alarms = [];
      Object.keys(alarmsObject).map(x => alarms.push(alarmsObject[x]));
      alarms[action.payload.alarm] = action.payload.data;
      return {
        ...state,
        alarms
      };
    default:
      return state;
  }
};

export default persistentReducer(AppState);
