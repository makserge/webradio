//import {
//  ADD_AUDIO_PLAYLIST,
//} from '../constants/ActionTypes';
import { persistentReducer } from '../store/redux-pouchdb';

const initialState = [{
  id: 1,
  title: 'Track 1',
  value: '/folder1',
},
{
  id: 2,
  title: 'Track 2',
  value: '/folder2',
},
{
  id: 3,
  title: 'Track 3',
  value: '/folder3',
}];

const AudioTrack = (state = initialState, action) => {
  switch (action.type) {
      default:
        return state;
    }
};

export default persistentReducer(AudioTrack);
