/* eslint-disable react/prop-types */
import React from 'react';
import i18n from 'i18next';

import TabBarIcon from './components/TabBarIcon';
import Radio from './containers/Radio';
import AudioPlayer from './containers/AudioPlayer';
import Aux from './containers/Aux';
import Settings from './containers/Settings';

export default {
  Radio: {
    screen: Radio,
    navigationOptions: () => ({
      drawerLabel: i18n.t('title.radio'),
      drawerIcon: ({ tintColor }) => <TabBarIcon icon="radio" tintColor={tintColor} />,
    }),
  },
  AudioPlayer: {
    screen: AudioPlayer,
    navigationOptions: () => ({
      drawerLabel: i18n.t('title.audioPlayer'),
      drawerIcon: ({ tintColor }) => <TabBarIcon icon="audiotrack" tintColor={tintColor} />,
    }),
  },
  Aux: {
    screen: Aux,
    navigationOptions: () => ({
      drawerLabel: i18n.t('title.aux'),
      drawerIcon: ({ tintColor }) => <TabBarIcon icon="input" tintColor={tintColor} />,
    }),
  },
  Settings: {
    screen: Settings,
    navigationOptions: () => ({
      drawerLabel: i18n.t('title.settings'),
      drawerIcon: ({ tintColor }) => <TabBarIcon icon="settings" tintColor={tintColor} />,
    }),
  },
};
