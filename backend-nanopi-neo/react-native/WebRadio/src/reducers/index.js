import { combineReducers } from 'redux';
import Navigation from './Navigation';
import WebRadio from './WebRadio';
import FmRadio from './FmRadio';
import AudioPlayList from './AudioPlayList';
import AudioTrack from './AudioTrack';
import AppState from './AppState';

const rootReducer = combineReducers({
  navigation: Navigation,
  webRadio: WebRadio,
  fmRadio: FmRadio,
  audioPlayList: AudioPlayList,
  audioTrack: AudioTrack,
  appState: AppState,
});

export default rootReducer;
