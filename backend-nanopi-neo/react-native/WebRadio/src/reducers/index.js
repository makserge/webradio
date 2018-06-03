import { combineReducers } from 'redux';

import Navigation from './Navigation';
import WebRadio from './WebRadio';
import FmRadio from './FmRadio';
import ContentDirTree from './ContentDirTree';
import AudioPlayList from './AudioPlayList';
import AudioTrack from './AudioTrack';
import AppState from './AppState';
import Alarm from './Alarm';

export default function createRootReducer(AppNavigator) {
  return combineReducers({
    navigation: Navigation(AppNavigator),
    webRadio: WebRadio,
    fmRadio: FmRadio,
    contentDirTree: ContentDirTree,
    audioPlayList: AudioPlayList,
    audioTrack: AudioTrack,
    appState: AppState,
    alarm: Alarm,
  });
}
