import React from 'react';
import PropTypes from 'prop-types';
import {
  COLOR,
  Toolbar,
  IconToggle
} from 'react-native-material-ui';
import uiTheme from '../../MaterialUiTheme';

const AppToolbar = (props) => {
  const {
    title,
    onVolumePress,
    sleepTimer,
    onTimerPress,
    power,
    onPowerPress,
    onLeftElementPress
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
          color={sleepTimer ? uiTheme.palette.accentColor : COLOR.white}
          onPress={onTimerPress}
        />,
        <IconToggle
          key="power"
          name="power-settings-new"
          color={power ? uiTheme.palette.accentColor : COLOR.white}
          onPress={onPowerPress}
        />
      ] }}
      onLeftElementPress={onLeftElementPress}
    />
  );
};

const propTypes = {
    title: PropTypes.string.isRequired,
    sleepTimer: PropTypes.bool.isRequired,
    onTimerPress: PropTypes.func.isRequired,
    power: PropTypes.bool.isRequired,
    onPowerPress: PropTypes.func.isRequired,
    onLeftElementPress: PropTypes.func.isRequired,
    onVolumePress: PropTypes.func.isRequired,
};

AppToolbar.propTypes = propTypes;
export default AppToolbar;
