import React, { PropTypes, Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView
} from 'react-native';
import {
  ThemeProvider
} from 'react-native-material-ui';
import AppToolbar from './AppToolbar';
import AppDrawer from './AppDrawer';
import VolumeDialog from './VolumeDialog';
import uiTheme from '../../MaterialUiTheme';
import {
  WEBRADIO_MODE
} from '../constants/AppModes';

const propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1
    }
});

class Container extends Component {
  state = {
    appMode: WEBRADIO_MODE,
    openDrawer: false,
    openVolume: false,
    volume: 10,
    volumeMute: false,
    timerOn: false,
    powerOn: false
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
    console.log('volume');
    this.setState({ openVolume: !this.state.openVolume });
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

  handleDrawerPress = (mode) => {
    console.log('mode', mode);
    this.setState({ appMode: mode });
    this.handleDrawerClose();
  }

  render() {
    const { containerStyle } = styles;

    return (
      <ThemeProvider uiTheme={uiTheme}>
        <View style={containerStyle}>
          <AppToolbar
            title="WebRadio"
            timerOn={this.state.timerOn}
            powerOn={this.state.powerOn}
            onLeftElementPress={this.handleDrawerToggle}
            onVolumePress={this.handleVolume}
            onTimerPress={this.handleTimer}
            onPowerPress={this.handlePower}
            onCenterElementPress={this.handleDrawerClose}
          />
          {this.state.openDrawer
            &&
            <AppDrawer
              mode={this.state.appMode}
              onPress={this.handleDrawerPress}
            />
          }
          {this.state.openVolume
            &&
            <VolumeDialog
              volume={this.state.volume}
              volumeMute={this.state.volumeMute}
              onVolumeChange={this.handleVolumeChange}
              onVolumeMutePress={this.handleVolumeMutePress}
              onClose={this.handleVolumeClose}
            />
          }
          <ScrollView>
            {this.props.children}
          </ScrollView>
        </View>
      </ThemeProvider>
    );
  }
}

Container.propTypes = propTypes;
export default Container;
