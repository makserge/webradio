import React, { PropTypes, PureComponent } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import AppToolbar from './AppToolbar';
import AppDrawer from './AppDrawer';
import VolumePopover from './VolumePopover';

const styles = StyleSheet.create({
  rootContainerStyle: {
    flex: 1
  },
});

class Container extends PureComponent {
  constructor(props) {
     super(props);
     this.state = {
       appMode: this.props.route,
       openDrawer: false,
       openVolume: false,
       volume: 10,
       volumeMute: false,
       timerOn: false,
       powerOn: false,
     };
  }

  handleDrawerToggle = () => this.setState({ openDrawer: !this.state.openDrawer });

  handleDrawerClose = () => this.setState({ openDrawer: false });

  handleVolumeChange = (volume) => {
    console.log('volume', volume);
    this.setState({ volume });
  }

  handleVolumeMutePress = () => {
    this.setState({ volumeMute: !this.state.volumeMute });
  }

  handleVolumeClose = () => this.setState({ openVolume: false });

  handleVolume = () => {
    this.setState({
      openVolume: !this.state.openVolume
    });
    this.handleDrawerClose();
  }

  handleTimer = () => {
    console.log('timer');
    this.setState({ timerOn: !this.state.timerOn });
    this.handleDrawerClose();
  }

  handlePower = () => {
    console.log('power');
    this.setState({ powerOn: !this.state.powerOn });
    this.handleDrawerClose();
  }

  handleDrawerPress = (route) => {
    console.log('mode', route);
    this.setState({ appMode: route });
    this.handleDrawerClose();
    this.props.navigator.replace(route);
  }

  render() {
    const { rootContainerStyle } = styles;
    const {
      timerOn,
      powerOn,
      openDrawer,
      appMode,
      openVolume,
      volume,
      volumeMute
    } = this.state;
    const { children, editItemDialog, addItemButton } = this.props;

    return (
      <View
        style={rootContainerStyle}
      >
        <AppToolbar
          title={appMode.title}
          timerOn={timerOn}
          powerOn={powerOn}
          onLeftElementPress={this.handleDrawerToggle}
          onVolumePress={this.handleVolume}
          onTimerPress={this.handleTimer}
          onPowerPress={this.handlePower}
          onCenterElementPress={this.handleDrawerClose}
        />
        {children}
        {openDrawer
        &&
          <AppDrawer
            route={appMode}
            onPress={this.handleDrawerPress}
          />
        }
        {addItemButton}
        {editItemDialog}
        {openVolume
        &&
          <VolumePopover
            volume={volume}
            volumeMute={volumeMute}
            onVolumeChange={this.handleVolumeChange}
            onVolumeMutePress={this.handleVolumeMutePress}
            onClose={this.handleVolumeClose}
          />
        }
      </View>
    );
  }
}

const propTypes = {
  navigator: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  editItemDialog: PropTypes.object,
  addItemButton: PropTypes.object,
};

Container.propTypes = propTypes;
export default Container;
