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
import WebRadio from '../components/webradio';
import FmRadio from '../components/fmradio';
import DabRadio from '../components/dabradio';

import * as itemsActions from '../actions/AudioPlayList';
import uiTheme from '../../MaterialUiTheme';

const TabNavigator = createMaterialTopTabNavigator({
  WebRadio: {
    screen: WebRadio,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('radio.webRadio'),
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon="router" tintColor={tintColor} />,
    }),
  },
  FmRadio: {
    screen: FmRadio,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('radio.fmRadio'),
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon="radio" tintColor={tintColor} />,
    }),
  },
  DabRadio: {
    screen: DabRadio,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('radio.dabRadio'),
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon="radio" tintColor={tintColor} />,
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

class Radio extends PureComponent {
  static router = TabNavigator.router;

  render() {
    const {
      navigation,
      actions,
      appState,
    } = this.props;
    return (
      <Container
        title={i18n.t('title.radio')}
        navigation={navigation}
        appState={appState}
        actions={actions}
      >
        <TabNavigator navigation={navigation} />
      </Container>
    );
  }
}

Radio.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Radio);
