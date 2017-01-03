import React, { Component } from 'react';

import injectTapEventPlugin from "react-tap-event-plugin";

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Router from 'material-ui/svg-icons/hardware/router';
import Radio from 'material-ui/svg-icons/av/radio';
import AvMusicVideo from 'material-ui/svg-icons/av/music-video';
import DeviceBluetooth from 'material-ui/svg-icons/device/bluetooth';
import AvAirplay from 'material-ui/svg-icons/av/airplay';
import Divider from 'material-ui/Divider';
import ActionInput from 'material-ui/svg-icons/action/input';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import AvVolumeMute from 'material-ui/svg-icons/av/volume-mute';
import AvVolumeOff from 'material-ui/svg-icons/av/volume-off';
import ActionPowerSettings from 'material-ui/svg-icons/action/power-settings-new';
import Popover from 'material-ui/Popover/Popover';
import Slider from 'material-ui/Slider';

const defaultStyle = {
  marginLeft: 20
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {openDrawer: false, openVolume: false, volume: 10, volumeMuted: false};
  }

  handleDrawerOpen = () => this.setState({openDrawer: true});

  handleVolumeTap = (event) => {
     event.preventDefault();

     this.setState({
       openVolume: true,
       anchorEl: event.currentTarget
     });
   };

  handleVolumeMuteTap = (event) => {
    console.log("volumemute", "clicked");
    this.setState({volumeMuted: !this.state.volumeMuted});
  };

  handleVolumeClose = () => this.setState({openVolume: false});

  handleSecondSlider = (event, value) => {
    this.setState({volume: value});
  };

  handlePowerTap() {
    console.log("power", "clicked");
  };

  render() {
    const rightButtonStyle = {
      width: 64,
      height: 48,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 0,
      paddingBottom: 0
    };
    const rightIconStyle = {
      width: 36,
      height: 36
    };
    const volumePopoverStyle = {
      width: 380,
      lineHeight: 10
    };
    const volumePopoverSliderStyle  = {
      display: "inline-block",
      verticalAlign: "middle",
      width: 250,
      height: 85,
      marginLeft: 35,
      marginTop: 30,
      marginBottom: 10
    };
    const volumeButtonStyle = {
      display: "inline-block",
      verticalAlign: "middle",
      width: 48,
      height: 48,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10
    };
    const rightButtons = (
      <div>
        <IconButton
          style={rightButtonStyle}
          iconStyle={rightIconStyle}
          onTouchTap={this.handleVolumeTap} >
          <AvVolumeMute
            color="white" />
        </IconButton>
        <Popover
          style={volumePopoverStyle}
          open={this.state.openVolume}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleVolumeClose} >

          <Slider
            style={volumePopoverSliderStyle}
            min={0}
            max={32}
            step={1}
            defaultValue={16}
            value={this.state.volume}
            onChange={this.handleVolume} />

            <IconButton
              style={volumeButtonStyle}
              iconStyle={rightIconStyle}
              onTouchTap={this.handleVolumeMuteTap} >
              {this.state.volumeMuted ? <AvVolumeOff /> : <AvVolumeMute />}
            </IconButton>
          </Popover>
        <IconButton
          style={rightButtonStyle}
          iconStyle={rightIconStyle}
          onTouchTap={this.handlePowerTap} >
          <ActionPowerSettings
            color="white" />
        </IconButton>
      </div>
    );
    return (
      <header className="header">
        <AppBar
          title={this.props.title}
          onLeftIconButtonTouchTap={this.handleDrawerOpen}
          iconElementRight={rightButtons} />
        <Drawer
          docked={false}
          width={200}
          open={this.state.openDrawer}
          onRequestChange={(openDrawer) => this.setState({openDrawer})} >
          <MenuItem
            leftIcon={<Router />}
            primaryText="Web Radio"
            onTouchTap={this.handleDrawerOpen}
            containerElement={<Link to="/webradio" />} />
          <MenuItem
            leftIcon={<Radio />}
            primaryText="FM Radio"
            onTouchTap={this.handleDrawerOpen}
            containerElement={<Link to="/fmradio" />} />
          <MenuItem
            leftIcon={<AvMusicVideo />}
            primaryText="Audio Player"
            onTouchTap={this.handleDrawerOpen}
            containerElement={<Link to="/audioplayer" />} />
          <MenuItem
            leftIcon={<DeviceBluetooth />}
            primaryText="Bluetooth"
            onTouchTap={this.handleDrawerOpen}
            containerElement={<Link to="/bluetooth" />} />
          <MenuItem
            leftIcon={<AvAirplay />}
            primaryText="AirPlay"
            onTouchTap={this.handleDrawerOpen}
            containerElement={<Link to="/airplay" />} />
          <MenuItem
            leftIcon={<ActionInput />}
            primaryText="Line In"
            onTouchTap={this.handleDrawerOpen}
            containerElement={<Link to="/linein" />} />
          <Divider />
          <MenuItem
            leftIcon={<ActionSettings />}
            primaryText="Settings"
            onTouchTap={this.handleDrawerOpen}
            containerElement={<Link to="/settings" />} />
        </Drawer>
        <h1 style={defaultStyle}>{this.props.subTitle}</h1>
      </header>
    );
  }
}

export default Header;
