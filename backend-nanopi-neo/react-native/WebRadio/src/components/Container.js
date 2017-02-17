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
import uiTheme from '../../MaterialUiTheme';
import {
  WEBRADIO_MODE,
  FMRADIO_MODE,
  AUDIO_PLAYER_MODE,
  BLUETOOTH_MODE,
  AIRPLAY_MODE,
  LINE_IN_MODE,
  SETTINGS_MODE
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
    openDrawer: false
  }

  handleDrawerToggle = () => this.setState({ openDrawer: !this.state.openDrawer });

  handleDrawerClose = () => this.setState({ openDrawer: false });

  handleVolume = () => {
    console.log('volume');
    this.handleDrawerClose();
  }

  handleTimer = () => {
    console.log('timer');
    this.handleDrawerClose();
  }

  handlePower = () => {
    console.log('power');
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
