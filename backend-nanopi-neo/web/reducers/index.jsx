import { combineReducers } from 'redux';
import WebRadio from './WebRadio';
import FmRadio from './FmRadio';
import AudioPlayerTracks from './AudioPlayerTracks';
import AudioPlayerPlaylists from './AudioPlayerPlaylists';
import AudioPlayerFolders from './AudioPlayerFolders';

const rootReducer = combineReducers({
    WebRadio,
    FmRadio,
    AudioPlayerTracks,
    AudioPlayerPlaylists,
    AudioPlayerFolders
});

export default rootReducer;
