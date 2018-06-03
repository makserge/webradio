import {
  createNavigationReducer,
} from 'react-navigation-redux-helpers';

import { persistentReducer } from '../store/redux-pouchdb';

const Navigation = (AppNavigator) => {
  return createNavigationReducer(AppNavigator);
};

export default persistentReducer(Navigation);
