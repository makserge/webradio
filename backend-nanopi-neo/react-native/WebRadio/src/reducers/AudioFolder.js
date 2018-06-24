import { persistentReducer } from '../store/redux-pouchdb';

const initialState = [];

const AudioFolder = (state = initialState) => state;

export default persistentReducer(AudioFolder);
