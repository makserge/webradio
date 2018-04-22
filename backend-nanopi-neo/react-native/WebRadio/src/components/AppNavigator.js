import React from 'react';
import PropTypes from 'prop-types';
import { DrawerNavigator, addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';
import { createReduxBoundAddListener} from 'react-navigation-redux-helpers';

import Routes from '../Routes';
import uiTheme from '../../MaterialUiTheme';

export const AppNavigator = DrawerNavigator(Routes, {
  contentOptions: {
    activeTintColor: uiTheme.palette.accentColor,
  },
});

const addListener = createReduxBoundAddListener("root");

const AppWithNavigationState = ({ dispatch, navigation }) =>
  <AppNavigator
    navigation={addNavigationHelpers({
      dispatch,
      state: navigation,
      addListener,
    })}
  />;

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  navigation: state.navigation,
});

export default connect(mapStateToProps)(AppWithNavigationState);
