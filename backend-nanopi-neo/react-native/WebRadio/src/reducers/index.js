import { combineReducers } from 'redux';
import WebRadio from './WebRadio';
import FmRadio from './FmRadio';
import AppState from './AppState';

const rootReducer = combineReducers({
    webRadio: WebRadio,
    fmRadio: FmRadio,
    appState: AppState,
});

export default rootReducer;
