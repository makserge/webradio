import React, { PropTypes, PureComponent } from 'react';
import {
  Platform,
  View,
  StyleSheet
} from 'react-native';
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
    console.log('props', props);
     super(props);
     this.state = {
       openVolume: false,
       volume: 10,
       volumeMute: false,
       timerOn: false,
       powerOn: false,
     };
  }

  handleDrawerOpen = () => {
    console.log('handleDrawerOpen');
    this.props.navigation.navigate('DrawerOpen');
  }

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
  }

  handleTimer = () => {
    console.log('timer');
    this.setState({ timerOn: !this.state.timerOn });
  }

  handlePower = () => {
    console.log('power');
    this.setState({ powerOn: !this.state.powerOn });
  }

  render() {
    const { rootContainerStyle } = styles;
    const {
      timerOn,
      powerOn,
      openVolume,
      volume,
      volumeMute
    } = this.state;
    const {
      title,
      children,
      editItemDialog,
      addItemButton
    } = this.props;

    return (
      <View
        style={rootContainerStyle}
      >
        <AppToolbar
          title={title}
          timerOn={timerOn}
          powerOn={powerOn}
          onLeftElementPress={this.handleDrawerOpen}
          onVolumePress={this.handleVolume}
          onTimerPress={this.handleTimer}
          onPowerPress={this.handlePower}
        />
        {children}
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
  title: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  editItemDialog: PropTypes.object,
  addItemButton: PropTypes.object,
};

Container.propTypes = propTypes;
export default Container;
