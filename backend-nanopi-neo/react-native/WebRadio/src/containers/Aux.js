/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { COLOR } from 'react-native-material-ui';
import { createMaterialTopTabNavigator } from 'react-navigation';
import i18n from 'i18next';

import TabBarIcon from '../components/TabBarIcon';
import Container from '../components/Container';
import Bluetooth from '../components/Bluetooth';
import AirPlay from '../components/AirPlay';
import AuxComponent from '../components/Aux';

import * as itemsActions from '../actions/AudioPlayList';
import uiTheme from '../../MaterialUiTheme';

const TabNavigator = createMaterialTopTabNavigator({
  Bluetooth: {
    screen: Bluetooth,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('aux.bluetooth'),
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon="bluetooth" tintColor={tintColor} />,
    }),
  },
  AirPlay: {
    screen: AirPlay,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('aux.airPlay'),
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon="airplay" tintColor={tintColor} />,
    }),
  },
  Aux: {
    screen: AuxComponent,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('aux.aux'),
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon="input" tintColor={tintColor} />,
    }),
  },
}, {
  tabBarPosition: 'top',
  swipeEnabled: true,
  tabBarOptions: {
    showIcon: true,
    activeTintColor: uiTheme.palette.accentColor,
    inactiveTintColor: COLOR.white,
    style: {
      backgroundColor: uiTheme.palette.primaryColor,
    },
    indicatorStyle: {
      backgroundColor: uiTheme.palette.accentColor,
    },
  },
});

class Aux extends PureComponent {
  static router = TabNavigator.router;

  render() {
    const {
      navigation,
      actions,
      appState,
    } = this.props;
    return (
      <Container
        title={i18n.t('title.aux')}
        navigation={navigation}
        appState={appState}
        actions={actions}
      >
        <TabNavigator navigation={navigation} />
      </Container>
    );
  }
}

Aux.propTypes = {
  actions: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.audioPlayList,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Aux);
