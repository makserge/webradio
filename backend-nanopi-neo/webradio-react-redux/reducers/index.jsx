import { combineReducers } from 'redux';
import WebRadio from './WebRadio';
import FmRadio from './FmRadio';
import AudioPlayer from './AudioPlayer';

const rootReducer = combineReducers({
    WebRadio,
    FmRadio,
    AudioPlayer
});

export default rootReducer;
