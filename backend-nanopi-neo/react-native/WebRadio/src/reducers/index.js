import { combineReducers } from 'redux';
import Navigation from './Navigation';
import WebRadio from './WebRadio';
import FmRadio from './FmRadio';
import ContentDirTree from './ContentDirTree';
import AudioPlayList from './AudioPlayList';
import AudioTrack from './AudioTrack';
import AppState from './AppState';
import Alarm from './Alarm';

const rootReducer = combineReducers({
  navigation: Navigation,
  webRadio: WebRadio,
  fmRadio: FmRadio,
  contentDirTree: ContentDirTree,
  audioPlayList: AudioPlayList,
  audioTrack: AudioTrack,
  appState: AppState,
  alarm: Alarm,
});

export default rootReducer;
