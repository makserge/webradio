import React, { PureComponent } from 'react';
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import {
  ThemeProvider,
} from 'react-native-material-ui';

import AppWithNavigationState, { store } from './components/AppNavigator';
import uiTheme from '../MaterialUiTheme';
import Notification from './components/Notification';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);

export default class App extends PureComponent {
  componentDidMount() {
    Notification(store);
  }

  render() {
    return (
      <Provider store={store}>
        <ThemeProvider
          uiTheme={uiTheme}
        >
          <AppWithNavigationState />
        </ThemeProvider>
      </Provider>
    );
  }
}
