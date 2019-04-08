import {
  NativeModules,
} from 'react-native';
import {
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import { NavigationActions } from 'react-navigation';

import { getMode } from '../actions/AppState';
import {
  WEB_RADIO_ROUTE_INDEX,
  RADIO_ROUTE_INDEX,
  AUDIO_PLAYER_ROUTE_INDEX,
  BLUETOOH_ROUTE_INDEX,
  AIRPLAY_ROUTE_INDEX,
  LINE_IN_ROUTE_INDEX,
  SETTINGS_ROUTE_INDEX,
  MEDIA_NOTIFICATION_ID,
} from '../constants/Common';

const REMOVE_NOTIFICATION_DELAY = 7000; // 7 sec

const RNNotifications = NativeModules.WixRNNotifications;

const onChangeNavigationScene = () => {
  setTimeout(
    () => RNNotifications.cancelLocalNotification(MEDIA_NOTIFICATION_ID),
    REMOVE_NOTIFICATION_DELAY,
  );
};

const mapModeToRoute = (mode) => {
  switch (mode) {
    case WEB_RADIO_ROUTE_INDEX:
      return 'WebRadio';
    case RADIO_ROUTE_INDEX:
      return 'Radio';
    case AUDIO_PLAYER_ROUTE_INDEX:
      return 'AudioPlayer';
    case BLUETOOH_ROUTE_INDEX:
      return 'Bluetooth';
    case AIRPLAY_ROUTE_INDEX:
      return 'AirPlay';
    case LINE_IN_ROUTE_INDEX:
      return 'LineIn';
    default:
      return 'WebRadio';
  }
};

const navigation = createReactNavigationReduxMiddleware(
  'root',
  state => state.navigation,
);

const getCurrentRouteIndex = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  return navigationState.index;
};

const screenTracking = store => next => (action) => {
  const currentState = store.getState();
  const currentScreen = getCurrentRouteIndex(currentState.navigation);
  const currentMode = currentState.appState.mode;
  const result = next(action);
  const newState = store.getState();
  const nextScreen = getCurrentRouteIndex(newState.navigation);
  const newMode = newState.appState.mode;

  if ((action.type === 'redux-pouchdb/SET_REDUCER' && action.reducer === 'AppState') && (newMode !== currentMode)) {
    store.dispatch(NavigationActions.navigate({ routeName: mapModeToRoute(newMode) }));
  } else if ((action.type === NavigationActions.NAVIGATE) && (nextScreen !== currentScreen)) {
    onChangeNavigationScene();
    if (nextScreen !== SETTINGS_ROUTE_INDEX) {
      store.dispatch(getMode(nextScreen));
    }
  }
  return result;
};

export { navigation, screenTracking };
