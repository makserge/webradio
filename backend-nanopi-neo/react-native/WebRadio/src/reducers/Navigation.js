import {
  createNavigationReducer,
} from 'react-navigation-redux-helpers';

const Navigation = (AppNavigator) => {
  return createNavigationReducer(AppNavigator);
};

export default Navigation;
