import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { COLOR } from 'react-native-material-ui';
import { createMaterialTopTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import i18n from 'i18next';

import Container from '../components/Container';
import AudioPlayList from '../components/audioplayer/AudioPlayList';
import AudioTrack from '../components/audioplayer/AudioTrack';
import AudioFolder from '../components/audioplayer/AudioFolder';

import * as itemsActions from '../actions/AudioPlayList';
import uiTheme from '../../MaterialUiTheme';

const TabBarIcon = ({ icon, tintColor }) => (
  <Icon
    name={icon}
    size={24}
    color={tintColor}
  />
);
TabBarIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  tintColor: PropTypes.string.isRequired,
};

const TabNavigator = createMaterialTopTabNavigator({
  Tracks: {
    screen: AudioTrack,
    navigationOptions: {
      tabBarLabel: i18n.t('audioPlayer.tracksTab'),
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon="audiotrack" tintColor={tintColor} />,
    },
  },
  Playlists: {
    screen: AudioPlayList,
    navigationOptions: {
      tabBarLabel: i18n.t('audioPlayer.playlistsTab'),
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon="playlist-play" tintColor={tintColor} />,
    },
  },
  Folders: {
    screen: AudioFolder,
    navigationOptions: {
      tabBarLabel: i18n.t('audioPlayer.foldersTab'),
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon="folder" tintColor={tintColor} />,
    },
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
