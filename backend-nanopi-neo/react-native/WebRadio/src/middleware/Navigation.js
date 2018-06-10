import {
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import { NavigationActions } from 'react-navigation';
import PushNotification from 'react-native-push-notification';

import { getMode } from '../actions/AppState';

const REMOVE_NOTIFICATION_DELAY = 7000; // 7 sec

const onChangeNavigationScene = () => {
  setTimeout(() => PushNotification.cancelAllLocalNotifications(), REMOVE_NOTIFICATION_DELAY);
};

const navigation = createReactNavigationReduxMiddleware(
  'root',
  state => state.navigation,
);

const getCurrentRouteName = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
};

const screenTracking = store => next => (action) => {
  const currentState = store.getState();
  const currentScreen = getCurrentRouteName(currentState.navigation);
  const currentMode = currentState.appState.mode;
  const result = next(action);
  const newState = store.getState();
  const nextScreen = getCurrentRouteName(newState.navigation);
  const newMode = newState.appState.mode;

  if ((action.type === 'redux-pouchdb/SET_REDUCER' && action.reducer === 'AppState') && (newMode !== currentMode)) {
    store.dispatch(NavigationActions.navigate({ routeName: newMode }));
  } else if ((action.type === NavigationActions.NAVIGATE) && (nextScreen !== currentScreen)) {
    onChangeNavigationScene();
    if (nextScreen !== 'Settings') {
      store.dispatch(getMode(nextScreen));
    }  
  }
  return result;
};

export { navigation, screenTracking };
