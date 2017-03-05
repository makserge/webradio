import React, { PropTypes } from 'react';
import {
  COLOR,
  Toolbar,
  IconToggle
} from 'react-native-material-ui';
import uiTheme from '../../MaterialUiTheme';

const propTypes = {
    title: PropTypes.string.isRequired,
    timerOn: PropTypes.bool.isRequired,
    onTimerPress: PropTypes.func.isRequired,
    powerOn: PropTypes.bool.isRequired,
    onPowerPress: PropTypes.func.isRequired,
    onLeftElementPress: PropTypes.func.isRequired,
    onCenterElementPress: PropTypes.func.isRequired,
    onVolumePress: PropTypes.func.isRequired,
};

const AppToolbar = (props) => {
  const {
    title,
    onVolumePress,
    timerOn,
    onTimerPress,
    powerOn,
    onPowerPress,
    onLeftElementPress,
    onCenterElementPress
  } = props;

  return (
    <Toolbar
      key="toolbar"
      leftElement="menu"
      centerElement={title}
      rightElement={{
        actions: [
        <IconToggle
          key="volume"
          name="volume-mute"
          color={COLOR.white}
          onPress={onVolumePress}
        />,
        <IconToggle
          key="timer"
          name="av-timer"
          color={timerOn ? uiTheme.palette.accentColor : COLOR.white}
          onPress={onTimerPress}
        />,
        <IconToggle
          key="power"
          name="power-settings-new"
          color={powerOn ? uiTheme.palette.accentColor : COLOR.white}
          onPress={onPowerPress}
        />
      ] }}
      onLeftElementPress={onLeftElementPress}
      onPress={onCenterElementPress}
    />
  );
};

AppToolbar.propTypes = propTypes;
export default AppToolbar;
