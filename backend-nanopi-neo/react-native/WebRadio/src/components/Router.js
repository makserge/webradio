import React, { Component } from 'react';
import { Navigator } from 'react-native';
import Routes from '../Routes';

class RouterComponent extends Component {
  static configureScene(route) {
    return route.animationType || Navigator.SceneConfigs.FloatFromRight;
  }

  static renderScene(route, navigator) {
    return (
        <route.page
          route={route}
          navigator={navigator}
        />
    );
  }

  render() {
    return (
      <Navigator
        configureScene={RouterComponent.configureScene}
        initialRoute={Routes.WebRadio}
        ref={this.onNavigatorRef}
        renderScene={RouterComponent.renderScene}
      />
    );
  }
}
export default RouterComponent;
