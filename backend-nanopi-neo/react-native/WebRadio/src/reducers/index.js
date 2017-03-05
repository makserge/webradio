import { combineReducers } from 'redux';
import WebRadio from './WebRadio';
import AppState from './AppState';

const rootReducer = combineReducers({
    webRadio: WebRadio,
    appState: AppState,
});

export default rootReducer;
