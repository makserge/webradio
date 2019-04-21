import { combineReducers } from 'redux';

import Navigation from './Navigation';
import WebRadio from './WebRadio';
import FmRadio from './FmRadio';
import DabRadio from './DabRadio';
import AudioPlayList from './AudioPlayList';
import AudioTrack from './AudioTrack';
import AudioFolder from './AudioFolder';
import AppState from './AppState';
import Alarm from './Alarm';

export default function createRootReducer(AppNavigator) {
  return combineReducers({
    navigation: Navigation(AppNavigator),
    webRadio: WebRadio,
    fmRadio: FmRadio,
    dabRadio: DabRadio,
    audioPlayList: AudioPlayList,
    audioTrack: AudioTrack,
    audioFolder: AudioFolder,
    appState: AppState,
    alarm: Alarm,
  });
}
