import React, { PropTypes } from 'react';
import {
  COLOR,
  Toolbar,
  IconToggle
} from 'react-native-material-ui';
import uiTheme from '../../MaterialUiTheme';

const propTypes = {
    title: PropTypes.string.isRequired,
    onLeftElementPress: PropTypes.func.isRequired,
    onCenterElementPress: PropTypes.func.isRequired,
    onVolumePress: PropTypes.func.isRequired,
    onTimerPress: PropTypes.func.isRequired,
    onPowerPress: PropTypes.func.isRequired,
};

const AppToolbar = (props) => (
    <Toolbar
        key="toolbar"
        leftElement="menu"
        centerElement={props.title}
        rightElement={[
          <IconToggle
            key="volume"
            name="volume-mute"
            color={COLOR.white}
            onPress={props.onVolumePress}
          />,
          <IconToggle
            key="timer"
            name="av-timer"
            color={props.timerOn ? uiTheme.palette.accentColor : COLOR.white}
            onPress={props.onTimerPress}
          />,
          <IconToggle
            key="power"
            name="power-settings-new"
            color={props.powerOn ? uiTheme.palette.accentColor : COLOR.white}
            onPress={props.onPowerPress}
          />
        ]}
        onLeftElementPress={props.onLeftElementPress}
        onPress={props.onCenterElementPress}
    />
);

AppToolbar.propTypes = propTypes;
export default AppToolbar;
