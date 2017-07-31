import { persistentReducer } from '../store/redux-pouchdb';

const initialState = [];

const ContentDirTree = (state = initialState) => state;

export default persistentReducer(ContentDirTree);
