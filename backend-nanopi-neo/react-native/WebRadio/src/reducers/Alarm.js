import {
  SET_ALARM
} from '../constants/ActionTypes';
import { persistentReducer } from '../store/redux-pouchdb';

const initialState = [
{
  id: 1,
  title: 'Alarm 1',
  enabled: true,
  hour: '08',
  min: '30',
  timeout: 60,
  days: [1, 2, 3, 4, 5],
  volume: 12,
  presetType: 'network',
  preset: 1,
},
{
  id: 2,
  title: 'Alarm 2',
  enabled: true,
  hour: '09',
  min: '00',
  timeout: 60,
  days: [6, 0],
  volume: 10,
  presetType: 'fm',
  preset: 2,
}
];

const Alarm = (state = initialState, action) => {
  switch (action.type) {
    // eslint-disable-next-line no-case-declarations
    case SET_ALARM:
      const newState = [];
      for (let i = 0; i < state.length; i++) {
        if (i === action.payload.alarm) {
          newState[i] = action.payload.data;
        } else {
          newState[i] = state[i];
        }
      }
      return newState;
    default:
      return state;
  }
};

export default persistentReducer(Alarm);
