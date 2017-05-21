import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import WebRadio from './containers/WebRadio';
import FmRadio from './containers/FmRadio';
import AudioPlayer from './containers/AudioPlayer';
import Bluetooth from './containers/Bluetooth';
import AirPlay from './containers/AirPlay';
import LineIn from './containers/LineIn';
import Settings from './containers/Settings';

const Icon = ({ name, color }) =>
  <MaterialIcons
    name={name}
    size={24}
    style={{ color }}
  />;

export default {
  WebRadio: {
    screen: WebRadio,
    navigationOptions: {
      drawerLabel: 'WebRadio',
      drawerIcon: ({ tintColor }) =>
        <Icon
          name='router'
          color={tintColor}
        />,
    },
  },
  FmRadio: {
    screen: FmRadio,
    navigationOptions: {
      drawerLabel: 'FM Radio',
      drawerIcon: ({ tintColor }) =>
        <Icon
          name="radio"
          color={tintColor}
        />,
    }
  },
  AudioPlayer: {
    screen: AudioPlayer,
    navigationOptions: {
      drawerLabel: 'Audio Player',
      drawerIcon: ({ tintColor }) =>
        <Icon
          name="audiotrack"
          color={tintColor}
        />,
    }
  },
  Bluetooth: {
    screen: Bluetooth,
    navigationOptions: {
      drawerLabel: 'Bluetooth',
      drawerIcon: ({ tintColor }) =>
        <Icon
          name="bluetooth"
          color={tintColor}
        />,
    }
  },
  AirPlay: {
    screen: AirPlay,
    navigationOptions: {
      drawerLabel: 'AirPlay',
      drawerIcon: ({ tintColor }) =>
        <Icon
          name="airplay"
          color={tintColor}
        />,
    }
  },
  LineIn: {
    screen: LineIn,
    navigationOptions: {
      drawerLabel: 'Line In',
      drawerIcon: ({ tintColor }) =>
        <Icon
          name="input"
          color={tintColor}
        />,
    }
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      drawerLabel: 'Settings',
      drawerIcon: ({ tintColor }) =>
        <Icon
          name="settings"
          color={tintColor}
        />,
    }
  }
};
