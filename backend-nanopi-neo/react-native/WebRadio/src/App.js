import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import {
  ThemeProvider
} from 'react-native-material-ui';
import configureStore from './store/configureStore';
import AppWithNavigationState from './components/AppNavigator';
import uiTheme from '../MaterialUiTheme';
import Notification from './components/Notification';

export default class App extends PureComponent {
  componentDidMount() {
    Notification();
  }

  render() {
    return (
      <Provider store={configureStore()}>
        <ThemeProvider
          uiTheme={uiTheme}
        >
          <AppWithNavigationState />
        </ThemeProvider>
      </Provider>
    );
  }
}
