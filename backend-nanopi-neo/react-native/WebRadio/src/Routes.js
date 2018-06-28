import React from 'react';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import i18n from 'i18next';

import WebRadio from './containers/WebRadio';
import FmRadio from './containers/FmRadio';
import AudioPlayer from './containers/AudioPlayer';
import Bluetooth from './containers/Bluetooth';
import AirPlay from './containers/AirPlay';
import LineIn from './containers/LineIn';
import Settings from './containers/Settings';

/* eslint-disable import/no-named-as-default-member */
const Icon = ({ name, color }) =>
  (<MaterialIcons
    name={name}
    size={24}
    style={{ color }}
  />);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default {
  WebRadio: {
    screen: WebRadio,
    navigationOptions: {
      drawerLabel: 'Web Radio',
      drawerIcon: ({ tintColor }) =>
        (<Icon
          name="router"
          color={tintColor}
        />),
    },
  },
  FmRadio: {
    screen: FmRadio,
    navigationOptions: {
      drawerLabel: 'FM Radio',
      drawerIcon: ({ tintColor }) =>
        (<Icon
          name="radio"
          color={tintColor}
        />),
    },
  },
  AudioPlayer: {
    screen: AudioPlayer,
    navigationOptions: {
      drawerLabel: 'Audio Player',
      drawerIcon: ({ tintColor }) =>
        (<Icon
          name="audiotrack"
          color={tintColor}
        />),
    },
  },
  Bluetooth: {
    screen: Bluetooth,
    navigationOptions: {
      drawerLabel: i18n.t('title.bluetooth'),
      drawerIcon: ({ tintColor }) =>
        (<Icon
          name="bluetooth"
          color={tintColor}
        />),
    },
  },
  AirPlay: {
    screen: AirPlay,
    navigationOptions: {
      drawerLabel: i18n.t('title.airPlay'),
      drawerIcon: ({ tintColor }) =>
        (<Icon
          name="airplay"
          color={tintColor}
        />),
    },
  },
  LineIn: {
    screen: LineIn,
    navigationOptions: {
      drawerLabel: i18n.t('title.lineIn'),
      drawerIcon: ({ tintColor }) =>
        (<Icon
          name="input"
          color={tintColor}
        />),
    },
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      drawerLabel: i18n.t('title.settings'),
      drawerIcon: ({ tintColor }) =>
        (<Icon
          name="settings"
          color={tintColor}
        />),
    },
  },
};
