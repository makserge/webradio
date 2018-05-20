import React from 'react';
import PropTypes from 'prop-types';
import { DrawerNavigator, addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';
import Routes from '../Routes';
import uiTheme from '../../MaterialUiTheme';

export const AppNavigator = DrawerNavigator(Routes, {
  contentOptions: {
    activeTintColor: uiTheme.palette.accentColor,
  },
});

const AppWithNavigationState = ({ dispatch, navigation }) =>
  (<AppNavigator
    navigation={addNavigationHelpers({ dispatch, state: navigation })}
  />);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  navigation: state.navigation,
});

export default connect(mapStateToProps)(AppWithNavigationState);
