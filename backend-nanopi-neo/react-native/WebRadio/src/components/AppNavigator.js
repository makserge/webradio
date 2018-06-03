import React, {Component } from 'react';
import PropTypes from 'prop-types';
import {
  createDrawerNavigator,
} from 'react-navigation';
import {
  createNavigationPropConstructor,
  initializeListeners,
} from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';

import Routes from '../Routes';
import uiTheme from '../../MaterialUiTheme';
import configureStore from '../store/ConfigureStore';

const AppNavigator = createDrawerNavigator(Routes, {
  initialRouteName: 'WebRadio',
  contentOptions: {
    activeTintColor: uiTheme.palette.accentColor,
  },
});

export const store = configureStore(AppNavigator);

class AppWithNavigationState extends Component {
  componentDidMount() {
    initializeListeners('root', this.props.navigation);
  }

  render() {
    const navigation = createNavigationPropConstructor('root')(
      this.props.dispatch,
      this.props.navigation,
    );
    return <AppNavigator navigation={navigation} />;
  }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  navigation: state.navigation,
});

export default connect(mapStateToProps)(AppWithNavigationState);
