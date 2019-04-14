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
import AudioTrack from '../components/audioplayer/AudioTrack';
import AudioPlayList from '../components/audioplayer/AudioPlayList';
import AudioFolder from '../components/audioplayer/AudioFolder';

import * as itemsActions from '../actions/AudioPlayList';
import uiTheme from '../../MaterialUiTheme';

const TabNavigator = createMaterialTopTabNavigator({
  Tracks: {
    screen: AudioTrack,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('audioPlayer.tracks'),
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon="audiotrack" tintColor={tintColor} />,
    }),
  },
  Playlists: {
    screen: AudioPlayList,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('audioPlayer.playlists'),
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon="playlist-play" tintColor={tintColor} />,
    }),
  },
  Folders: {
    screen: AudioFolder,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('audioPlayer.folders'),
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon="folder" tintColor={tintColor} />,
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

class AudioPlayer extends PureComponent {
  static router = TabNavigator.router;

  render() {
    const {
      navigation,
      actions,
      appState,
    } = this.props;
    return (
      <Container
        title={i18n.t('title.audioPlayer')}
        navigation={navigation}
        appState={appState}
        actions={actions}
      >
        <TabNavigator navigation={navigation} />
      </Container>
    );
  }
}

AudioPlayer.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
