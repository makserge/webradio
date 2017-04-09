import { combineReducers } from 'redux';
import WebRadio from './WebRadio';
import FmRadio from './FmRadio';
import AudioPlayer from './AudioPlayer';
import AppState from './AppState';

const rootReducer = combineReducers({
    webRadio: WebRadio,
    fmRadio: FmRadio,
    audioPlayer: AudioPlayer,
    appState: AppState,
});

export default rootReducer;
