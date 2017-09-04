import { DEFAULT_ROUTE } from '../constants/ActionTypes';
import { AppNavigator } from '../components/AppNavigator';
import { persistentReducer } from '../store/redux-pouchdb';

const initialState = AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams(DEFAULT_ROUTE));

const Navigation = (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);

  return nextState || state;
};

export default persistentReducer(Navigation);
