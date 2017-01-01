import React, { PropTypes, Component } from 'react';
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

class LeftDrawer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <Drawer
      docked={false}
      width={200}
      open={this.props.open}
      onRequestChange={(open) => this.props.onToggleDrawer}>
        <MenuItem leftIcon={<Router />} primaryText="Webradio" onTouchTap={this.props.onToggleDrawer} />
        <MenuItem leftIcon={<Radio />} primaryText="FM Radio" onTouchTap={this.props.onToggleDrawer} />
        <MenuItem leftIcon={<AvMusicVideo />} primaryText="Audio Player" onTouchTap={this.props.onToggleDrawer} />
        <MenuItem leftIcon={<DeviceBluetooth />} primaryText="Bluetooth" onTouchTap={this.props.onToggleDrawer} />
        <MenuItem leftIcon={<AvAirplay />} primaryText="AirPlay" onTouchTap={this.props.onToggleDrawer} />
        <MenuItem leftIcon={<ActionInput />} primaryText="Line In" onTouchTap={this.props.onToggleDrawer} />
        <Divider />
        <MenuItem leftIcon={<ActionSettings />} primaryText="Settings" onTouchTap={this.props.onToggleDrawer} />
    </Drawer>
    );
  }
}

export default LeftDrawer;
