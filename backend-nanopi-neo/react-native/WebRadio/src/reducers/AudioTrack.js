//import {
//  ADD_AUDIO_PLAYLIST,
//} from '../constants/ActionTypes';

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

export default function AudioPlaylist(state = initialState, action) {
  switch (action.type) {
      default:
        return state;
    }
}
