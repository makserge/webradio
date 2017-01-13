import { combineReducers } from 'redux';
import WebRadio from './WebRadio';
import FmRadio from './FmRadio';

const rootReducer = combineReducers({
    WebRadio,
    FmRadio
});

export default rootReducer;
