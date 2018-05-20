import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  View,
  StyleSheet,
} from 'react-native';

import {
  DRAWER_OPEN_SCENE,
} from '../constants/Common';
import AppToolbar from './AppToolbar';
import VolumePopover from './VolumePopover';

const styles = StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

class Container extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openVolume: false,
    };
  }

  handleDrawerOpen = () => {
    this.props.navigation.navigate(DRAWER_OPEN_SCENE);
  }

  handleVolumeClose = () => this.setState({ openVolume: false });

  handleVolume = () => {
    this.setState({
      openVolume: !this.state.openVolume,
    });
  }

  render() {
    const { rootContainerStyle } = styles;
    const {
      openVolume,
    } = this.state;
    const {
      title,
      appState,
      children,
      editItemDialog,
      addItemButton,
      actions,
    } = this.props;

    return (
      <View
        style={rootContainerStyle}
      >
        <AppToolbar
          title={title}
          sleepTimer={appState.sleepTimerOn}
          power={appState.power}
          onLeftElementPress={this.handleDrawerOpen}
          onVolumePress={this.handleVolume}
          onTimerPress={() => {
            if (appState.power) {
              actions.toggleSleepTimer();
            }
          }}
          onPowerPress={actions.togglePower}
        />
        {children}
        {addItemButton}
        {editItemDialog}
        {openVolume
        &&
          <VolumePopover
            volume={appState.volume}
            volumeMute={appState.volumeMute}
            onVolumeChange={actions.setVolume}
            onVolumeMutePress={actions.toggleVolumeMute}
            onClose={this.handleVolumeClose}
          />
        }
      </View>
    );
  }
}

Container.propTypes = {
  title: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  editItemDialog: PropTypes.object,
  addItemButton: PropTypes.object,
};

Container.defaultProps = {
  editItemDialog: null,
  addItemButton: null,
};

export default Container;
