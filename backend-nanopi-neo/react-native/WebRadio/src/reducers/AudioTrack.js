import { persistentReducer } from '../store/redux-pouchdb';

const initialState = [];

const AudioTrack = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default persistentReducer(AudioTrack);
