import React, { PropTypes } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import { Drawer } from 'react-native-material-ui';
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
    mode: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    drawerStyle: {
      width: 200,
      height: 600,
      elevation: 4
    },
});

const AppDrawer = (props) => (
<View style={styles.drawerStyle}>
  <Drawer>
    <Drawer.Section
      divider
      items={[
        {
          icon: 'router',
          value: 'Web Radio',
          active: (WEBRADIO_MODE === props.mode),
          onPress: () => props.onPress(WEBRADIO_MODE)
        },
        {
          icon: 'radio',
          value: 'FM Radio',
          active: (FMRADIO_MODE === props.mode),
          onPress: () => props.onPress(FMRADIO_MODE)
        },
        {
          icon: 'audiotrack',
          value: 'Audio Player',
          active: (AUDIO_PLAYER_MODE === props.mode),
          onPress: () => props.onPress(AUDIO_PLAYER_MODE)
        },
        {
          icon: 'bluetooth',
          value: 'Bluetooth',
          active: (BLUETOOTH_MODE === props.mode),
          onPress: () => props.onPress(BLUETOOTH_MODE)
        },
        {
          icon: 'airplay',
          value: 'AirPlay',
          active: (AIRPLAY_MODE === props.mode),
          onPress: () => props.onPress(AIRPLAY_MODE)
        },
        {
          icon: 'input',
          value: 'Line In',
          active: (LINE_IN_MODE === props.mode),
          onPress: () => props.onPress(LINE_IN_MODE)
        }
      ]}
    />
    <Drawer.Section
      items={[
        {
          icon: 'settings',
          value: 'Settings',
          active: (SETTINGS_MODE === props.mode),
          onPress: () => props.onPress(SETTINGS_MODE)
        }
      ]}
    />
  </Drawer>
</View>
);

AppDrawer.propTypes = propTypes;
export default AppDrawer;
