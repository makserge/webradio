import React, { PropTypes } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import { Drawer } from 'react-native-material-ui';
import Routes from '../Routes';

const propTypes = {
  route: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  drawerStyle: {
    position: 'absolute',
    zIndex: 1,
    width: 200,
    height: 600,
    elevation: 4
  }
});

const AppDrawer = (props) => (
  <View
    style={styles.drawerStyle}
  >
    <Drawer>
      <Drawer.Section
        divider
        items={[
        {
          icon: Routes.WebRadio.icon,
          value: Routes.WebRadio.title,
          active: (Routes.WebRadio === props.route),
          onPress: () => props.onPress(Routes.WebRadio)
        },
        {
          icon: Routes.FmRadio.icon,
          value: Routes.FmRadio.title,
          active: (Routes.FmRadio === props.route),
          onPress: () => props.onPress(Routes.FmRadio)
        },
        {
          icon: Routes.AudioPlayer.icon,
          value: Routes.AudioPlayer.title,
          active: (Routes.AudioPlayer === props.route),
          onPress: () => props.onPress(Routes.AudioPlayer)
        },
        {
          icon: Routes.Bluetooth.icon,
          value: Routes.Bluetooth.title,
          active: (Routes.Bluetooth === props.route),
          onPress: () => props.onPress(Routes.Bluetooth)
        },
        {
          icon: Routes.AirPlay.icon,
          value: Routes.AirPlay.title,
          active: (Routes.AirPlay === props.route),
          onPress: () => props.onPress(Routes.AirPlay)
        },
        {
          icon: Routes.LineIn.icon,
          value: Routes.LineIn.title,
          active: (Routes.LineIn === props.route),
          onPress: () => props.onPress(Routes.LineIn)
        }
        ]}
      />
    <Drawer.Section
      items={[
        {
          icon: Routes.Settings.icon,
          value: Routes.Settings.title,
          active: (Routes.Settings === props.route),
          onPress: () => props.onPress(Routes.Settings)
        }
      ]}
    />
  </Drawer>
</View>
);

AppDrawer.propTypes = propTypes;
export default AppDrawer;
