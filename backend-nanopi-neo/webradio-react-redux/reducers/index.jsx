import { combineReducers } from 'redux';
import WebRadio from './WebRadio';
import FmRadio from './FmRadio';
import AudioPlayerPlaylists from './AudioPlayerPlaylists';
import AudioPlayerFolders from './AudioPlayerFolders';

const rootReducer = combineReducers({
    WebRadio,
    FmRadio,
    AudioPlayerPlaylists,
    AudioPlayerFolders
});

export default rootReducer;
