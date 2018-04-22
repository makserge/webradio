import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'react-native-material-ui';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import configureStore from './store/configureStore';
import AppWithNavigationState from './components/AppNavigator';
import uiTheme from '../MaterialUiTheme';
import Notification from './components/Notification';
import rootReducer from './reducers';

console.ignoredYellowBox = [
    'Setting a timer'
];

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.navigation,
);

const store = createStore(
  rootReducer,
  applyMiddleware(middleware),
);

export default class App extends PureComponent {
  componentDidMount() {
    Notification();
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
