import React, { PureComponent } from 'react';
import {
  createAppContainer,
  createDrawerNavigator,
} from 'react-navigation';
import {
  connect,
  Provider,
} from 'react-redux';
import {
  ThemeContext,
  getTheme,
} from 'react-native-material-ui';
import { reduxifyNavigator } from 'react-navigation-redux-helpers';

import Routes from './Routes';
import configureStore from './store/ConfigureStore';

import uiTheme from '../MaterialUiTheme';
import Notification from './components/Notification';

const AppNavigator = createDrawerNavigator(Routes, {
  initialRouteName: 'Radio',
  contentOptions: {
    activeTintColor: uiTheme.palette.accentColor,
  },
});

const mapStateToProps = state => ({
  state: state.navigation,
});

const store = configureStore(AppNavigator);

const AppWithNavigationState = connect(mapStateToProps)(reduxifyNavigator(createAppContainer(AppNavigator), 'root'));

export default class App extends PureComponent {
  componentDidMount() {
    Notification(store);
  }

  render() {
    return (
      <Provider store={store}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <AppWithNavigationState />
        </ThemeContext.Provider>
      </Provider>
    );
  }
}
