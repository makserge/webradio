import {
  NativeModules,
} from 'react-native';
import {
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import { NavigationActions } from 'react-navigation';

import { getMode } from '../actions/AppState';
import {
  RADIO_DRAWER_INDEX,
  AUDIO_PLAYER_DRAWER_INDEX,
  EXTERNAL_DRAWER_INDEX,
  WEB_RADIO_ROUTE_INDEX,
  FM_RADIO_ROUTE_INDEX,
  DAB_RADIO_ROUTE_INDEX,
  AUDIO_PLAYER_ROUTE_INDEX,
  BLUETOOH_ROUTE_INDEX,
  AIRPLAY_ROUTE_INDEX,
  AUX_ROUTE_INDEX,
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
    case FM_RADIO_ROUTE_INDEX:
      return 'FmRadio';
    case DAB_RADIO_ROUTE_INDEX:
      return 'DabRadio';
    case AUDIO_PLAYER_ROUTE_INDEX:
      return 'AudioPlayer';
    case BLUETOOH_ROUTE_INDEX:
      return 'Bluetooth';
    case AIRPLAY_ROUTE_INDEX:
      return 'AirPlay';
    case AUX_ROUTE_INDEX:
      return 'Aux';
    default:
      return 'WebRadio';
  }
};

const navigation = createReactNavigationReduxMiddleware(
  'root',
  state => state.navigation,
);

const screenTracking = store => next => (action) => {
  const currentState = store.getState();
  const result = next(action);
  const newState = store.getState();

  if ((action.type === 'redux-pouchdb/SET_REDUCER' && action.reducer === 'AppState')) {
    const currentMode = currentState.appState.mode;
    const newMode = newState.appState.mode;
    if (newMode !== currentMode) {
      store.dispatch(NavigationActions.navigate({ routeName: mapModeToRoute(newMode) }));
    }
  } else if (action.type === NavigationActions.NAVIGATE) {
    const newDrawerItem = newState.navigation.index;

    const currentRadio = currentState.navigation.routes[RADIO_DRAWER_INDEX].index;
    const newRadio = newState.navigation.routes[RADIO_DRAWER_INDEX].index;

    const currentExternal = currentState.navigation.routes[EXTERNAL_DRAWER_INDEX].index;
    const newExternal = newState.navigation.routes[EXTERNAL_DRAWER_INDEX].index;

    if (newRadio !== currentRadio || newDrawerItem === RADIO_DRAWER_INDEX) {
      onChangeNavigationScene();
      store.dispatch(getMode(newRadio));
    } else if (newDrawerItem === AUDIO_PLAYER_DRAWER_INDEX) {
      onChangeNavigationScene();
      store.dispatch(getMode(AUDIO_PLAYER_ROUTE_INDEX));
    } else if (newExternal !== currentExternal || newDrawerItem === EXTERNAL_DRAWER_INDEX) {
      onChangeNavigationScene();
      store.dispatch(getMode(newExternal + 4));
    }
  }
  return result;
};

export { navigation, screenTracking };
