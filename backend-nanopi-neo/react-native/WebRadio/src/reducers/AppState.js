import {
  TOGGLE_POWER,
  TOGGLE_SLEEP_TIMER,
  SET_VOLUME,
  TOGGLE_VOLUME_MUTE,
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
  PLAY_AUDIO_TRACK,
  SET_SLEEP_TIMER,
  SET_ALARM,
} from '../constants/ActionTypes';

const initialState = {
  power: false,
  sleepTimerOn: false,
  volume: 10,
  volumeMute: false,
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
  selectedAudioTrackId: 0,
  sleepTimer: 60,
  alarms: [
  {
    enabled: true,
    time: '08:30',
    timeout: 60,
    days: [1, 2, 3, 4, 5],
    volume: 12,
    presetType: 'network',
    preset: 1,
  },
  {
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

export default function State(state = initialState, action) {
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
      const alarms = state.alarms;
      alarms[action.payload.alarm] = action.payload.data;
      return {
        ...state,
        alarms
      };
    default:
      return state;
  }
}
