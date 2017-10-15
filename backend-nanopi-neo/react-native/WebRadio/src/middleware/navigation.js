import { NavigationActions } from 'react-navigation';
import PushNotification from 'react-native-push-notification';
import {
  DRAWER_OPEN_SCENE,
} from '../constants/Common';

const REMOVE_NOTIFICATION_DELAY = 7000; //7 sec

const onChangeNavigationScene = () => {
  setTimeout(() => PushNotification.cancelAllLocalNotifications(), REMOVE_NOTIFICATION_DELAY);
};

const getCurrentRouteName = navigationState => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
};

const navigation = ({ getState }) => next => (action) => {
  if (
    action.type !== NavigationActions.NAVIGATE
    && action.type !== NavigationActions.BACK
  ) {
    return next(action);
  }

  const currentScreen = getCurrentRouteName(getState().navigation);
  const result = next(action);
  const nextScreen = getCurrentRouteName(getState().navigation);
  if (nextScreen !== currentScreen) {
    if (nextScreen !== DRAWER_OPEN_SCENE) {
      onChangeNavigationScene(nextScreen);
    }
  }
  return result;
};

export default navigation;
