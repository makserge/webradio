import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  View,
  StyleSheet,
} from 'react-native';
import {
  COLOR,
  Toolbar,
  IconToggle,
} from 'react-native-material-ui';

import VolumePopover from './VolumePopover';
import uiTheme from '../../MaterialUiTheme';

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

  onLeftElementPress = () => {
    const { navigation } = this.props;
    navigation.openDrawer();
  }

  handleVolumeClose = () => this.setState({ openVolume: false });

  onVolumePress = () => {
    const { openVolume } = this.state;
    this.setState({
      openVolume: !openVolume,
    });
  }

  onTimerPress = (appState, actions) => {
    if (appState.power) {
      actions.toggleSleepTimer();
    }
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

    const toolBarActions = [
      <IconToggle
        key="volume"
        name="volume-mute"
        color={COLOR.white}
        onPress={this.onVolumePress}
      />,
      <IconToggle
        key="timer"
        name="av-timer"
        color={appState.sleepTimerOn ? uiTheme.palette.accentColor : COLOR.white}
        onPress={() => this.onTimerPress(appState, actions)}
      />,
      <IconToggle
        key="power"
        name="power-settings-new"
        color={appState.power ? uiTheme.palette.accentColor : COLOR.white}
        onPress={actions.togglePower}
      />,
    ];

    return (
      <View style={rootContainerStyle}>
        <Toolbar
          key="toolbar"
          leftElement="menu"
          centerElement={title}
          rightElement={{ actions: toolBarActions }}
          onLeftElementPress={this.onLeftElementPress}
        />
        {children}
        {addItemButton}
        {editItemDialog}
        {openVolume
        && (
        <VolumePopover
          volume={appState.volume}
          volumeMute={appState.volumeMute}
          onVolumeChange={actions.setVolume}
          onVolumeMutePress={actions.toggleVolumeMute}
          onClose={this.handleVolumeClose}
        />
        )}
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
