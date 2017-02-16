import React, { Component, PropTypes } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Subheader from 'material-ui/Subheader';
import * as Actions from '../actions/Settings';
import TimePicker from 'material-ui/TimePicker';
import Toggle from 'material-ui/Toggle';
import { List, ListItem } from 'material-ui/List';
import Popover from 'material-ui/Popover/Popover';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import * as Colors from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from '../src/MaterialUiTheme';

class Settings extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      openSleepTimer: false,
      sleepTimer: 60,
      alarm1:
      {
        timeOn: new Date(1, 1 , 1, 9, 0, 0),
        timeOnText: '9:00',
        timeOff: new Date(1, 1 , 1, 10, 0, 0),
        timeOffText: '10:00',
        weekDaysText: 'Monday, Thursday, Wednesday, Tuesday, Friday',
        volume: 16,
        presetTypeText: 'Net',
        presetText: 'Stream 1'
      },
      alarm2:
      {
        timeOn: new Date(1, 1 , 1, 9, 0, 0),
        timeOnText: '9:00',
        timeOff: new Date(1, 1 , 1, 10, 0, 0),
        timeOffText: '10:00',
        weekDaysText: 'Saturday, Sunday',
        volume: 16,
        presetTypeText: 'Net',
        presetText: 'Stream 1'
      }
    }
  }

  handleSleepTimerTap = (event) => {
     event.preventDefault();

     this.setState({
       openSleepTimer: true,
       anchorEl: event.currentTarget
     });
  };

  handleSleepTimerClose = () => this.setState({openSleepTimer: false});

  handleSleepTimerSelectTap = (value) => {
    this.setState({
      openSleepTimer: false,
      sleepTimer: value
    });
    console.log("sleep", value);
    //this.props.actions.setSleepTimer(value);
  };



  handleChangeAlarm1TimeOn = (event, date) => {
    console.log(date);
    this.setState({alarm1TimeOn: date});
  };

  handleChangeAlarm1TimeOff = (event, date) => {
    console.log(date);
    this.setState({alarm1TimeOff: date});
  };

  render() {
    const defaultStyle = {
      width: "98%",
      marginLeft: 20
    };
    const sleepTimer = [
      { title: '10 min', value: 10 },
      { title: '20 min', value: 20 },
      { title: '30 min', value: 30 },
      { title: '40 min', value: 40 },
      { title: '50 min', value: 50 },
      { title: '60 min', value: 60 },
      { title: '70 min', value: 70 },
      { title: '80 min', value: 80 },
      { title: '90 min', value: 90 },
      { title: '100 min', value: 100 },
      { title: '110 min', value: 110 },
      { title: '120 min', value: 120 }
    ];
    const { items, actions } = this.props;
    return (
      <div>
        <MuiThemeProvider
          muiTheme={Theme}>
          <div>
            <Header
              title="Settings" />
              <section
                className="main"
                style={defaultStyle}>
                <List>
                  <Subheader>Network parameters</Subheader>
                  <ListItem
                    primaryText="Ip address"
                    secondaryText="192.168.1.1"
                  />
                  <Subheader>Sleep timer</Subheader>
                  <ListItem
                    primaryText="Timeout"
                    secondaryText={<span>{this.state.sleepTimer} min.</span>}
                    onTouchTap={this.handleSleepTimerTap}
                  />
                  <Popover
                    open={this.state.openSleepTimer}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.handleSleepTimerClose} >
                    <List>
                      {sleepTimer.map(item =>
                        <ListItem
                          value={item.value}
                          primaryText={item.title}
                          leftIcon={item.value === this.state.sleepTimer ? (
                          <NavigationCheck />
                          ) :
                          (
                          <NavigationCheck
                            color={Colors.white} />
                          )
                          }
                          onTouchTap={() => this.handleSleepTimerSelectTap(item.value)}
                        />
                      )}
                    </List>
                  </Popover>
                  <Subheader>Alarm1</Subheader>
                  <ListItem
                    primaryText="Enable"
                    rightToggle={<Toggle />} />
                  <ListItem
                    primaryText="Switch on time"
                    secondaryText={
                    <span>
                      <TimePicker
                        format="24hr"
                        value={this.state.alarm1.timeOn}
                        onChange={this.handleChangeAlarm1TimeOn} />
                    </span>
                    } />
                  <ListItem
                    primaryText="Switch off time"
                    secondaryText={this.state.alarm1.timeOffText} />
                  <ListItem
                    primaryText="Week days"
                    secondaryText={this.state.alarm1.weekDaysText} />
                  <ListItem
                    primaryText="Volume"
                    secondaryText={this.state.alarm1.volume} />
                  <ListItem
                    primaryText="Preeet"
                    secondaryText={<span>Type: {this.state.alarm1.presetTypeText}, Preset: {this.state.alarm1.presetText}</span>} />
                  <Subheader>Alarm2</Subheader>
                  <ListItem
                    primaryText="Enable"
                    rightToggle={<Toggle />} />
                  <ListItem
                    primaryText="Switch on time"
                    secondaryText={this.state.alarm2.timeOnText} />
                  <ListItem
                    primaryText="Switch off time"
                    secondaryText={this.state.alarm2.timeOffText} />
                  <ListItem
                    primaryText="Week days"
                    secondaryText={this.state.alarm2.weekDaysText} />
                  <ListItem
                    primaryText="Volume"
                    secondaryText={this.state.alarm2.volume} />
                  <ListItem
                    primaryText="Preeet"
                    secondaryText={<span>Type: {this.state.alarm2.presetTypeText}, Preset: {this.state.alarm2.presetText}</span>} />
                </List>
              </section>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
/*
<TimePicker
  style={defaultStyle}
  format="24hr"
  value={this.state.alarm1TimeOn}
  onChange={this.handleChangeAlarm1TimeOn} />
<TimePicker
  style={defaultStyle}
  format="24hr"
  value={this.state.alarm1TimeOff}
  onChange={this.handleChangeAlarm1TimeOff} />
*/
const mapStateToProps = (state) => {
  return {
    items: state.items
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
