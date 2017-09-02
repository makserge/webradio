import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Switch,
  Slider,
  Text,
  Picker
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Checkbox,
  RadioButton,
} from 'react-native-material-ui';
import i18n from 'i18next';

import TimerPicker from '../settings/TimerPicker';
import uiTheme from '../../../MaterialUiTheme';

/* eslint-disable import/no-named-as-default-member */
const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginRight: 10
  },
  subContainer: {
    marginTop: 15,
  },
  onSwitch: {
    width: 50,
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  timePicker: {
    width: 100
  },
  timePickerIcon: {
    position: 'absolute',
    left: 5,
    top: 6,
    marginLeft: 0
  },
  timeoutIcon: {
    marginLeft: 20
  },
  volumeIcon: {
    marginLeft: 10
  },
  slider: {
    flex: 1,
    marginLeft: 10,
  },
  volumeValue: {
    marginLeft: 10,
    fontSize: 18,
    width: 25
  },
  preset: {
    width: 250
  }
});

const WeekDays = ({ days, onChange }) =>
  <View
    style={styles.subContainer}
  >
    <View
      style={styles.row}
    >
      <Checkbox
        label={i18n.t('alarm.monday')}
        value={1}
        checked={days.includes(1)}
        onCheck={checked => onChange(checked, 1)}
      />
      <Checkbox
        label={i18n.t('alarm.tuesday')}
        value={2}
        checked={days.includes(2)}
        onCheck={checked => onChange(checked, 2)}
      />
      <Checkbox
        label={i18n.t('alarm.wednesday')}
        value={3}
        checked={days.includes(3)}
        onCheck={checked => onChange(checked, 3)}
      />
    </View>
    <View
      style={styles.row}
    >
      <Checkbox
        label={i18n.t('alarm.thursday')}
        value={4}
        checked={days.includes(4)}
        onCheck={checked => onChange(checked, 4)}
      />
      <Checkbox
        label={i18n.t('alarm.friday')}
        value={5}
        checked={days.includes(5)}
        onCheck={checked => onChange(checked, 5)}
      />
      <Checkbox
        label={i18n.t('alarm.saturday')}
        value={6}
        checked={days.includes(6)}
        onCheck={checked => onChange(checked, 6)}
      />
    </View>
    <View
      style={styles.row}
    >
      <Checkbox
        label={i18n.t('alarm.sunday')}
        value={7}
        checked={days.includes(7)}
        onCheck={checked => onChange(checked, 7)}
      />
    </View>
  </View>;

const Volume = ({ value, onChange }) =>
  <View
    style={[styles.row, styles.subContainer]}
  >
    <Icon
      style={styles.volumeIcon}
      name="volume-mute"
      size={24}
    />
    <Slider
      style={styles.slider}
      value={value}
      minimumValue={0}
      maximumValue={32}
      step={1}
      onValueChange={onChange}
    />
    <Text
      style={styles.volumeValue}
    >
      {value}
    </Text>
  </View>;

const Preset = ({ type, preset, presets, onChangeType, onChange }) =>
  <View
    style={[styles.row, styles.subContainer]}
  >
    <RadioButton
      checked={type === 'network'}
      uncheckedIcon="router"
      checkedIcon="router"
      value="network"
      onCheck={() => onChangeType('network')}
    />
    <RadioButton
      checked={type === 'fm'}
      uncheckedIcon="radio"
      checkedIcon="radio"
      value="fmradio"
      onCheck={() => onChangeType('fm')}
    />
    <Picker
      style={styles.preset}
      mode="dropdown"
      selectedValue={preset}
      onValueChange={onChange}
    >
      {presets.map(item => <Picker.Item key={item.id} label={item.title} value={item.id} />)}
    </Picker>
  </View>;

  class Alarm extends PureComponent {
    constructor(props) {
       super(props);
       this.state = { ...props.data };
    }

    componentWillReceiveProps(props) {
      this.setState({ ...props.data });
    }

    onChange = () => {
      this.props.onChange({ ...this.state });
    }

    setEnabled = (enabled) => {
      this.setState({
        enabled
      }, this.onChange);
    }

    setTime = (time) => {
      this.setState({
        time
      }, this.onChange);
    }

    setTimeout = (timeout) => {
      this.setState({
        timeout
      }, this.onChange);
    }

    setWeekDay = (checked, value) => {
      let days = this.state.days;
      if (checked) {
        days = days.concat([value]).sort();
      } else {
        days = days.filter(item => item !== value);
      }
      this.setState({
        days
      }, this.onChange);
    }

    setVolume = (volume) => {
      this.setState({
        volume
      }, this.onChange);
    }

    setPresetType = (presetType) => {
      this.setState({
        presetType
      }, this.onChange);
    }

    setPreset = (preset) => {
      this.setState({
        preset
      }, this.onChange);
    }

    render() {
      const {
        container,
        onSwitch,
        row,
        subContainer,
        timePicker,
        timePickerIcon,
        timeoutIcon,
      } = styles;
      const {
        enabled,
        time,
        timeout,
        days,
        volume,
        presetType,
        preset,
      } = this.state;
      const {
        data,
        presets,
      } = this.props;
      return (
        <View
          style={container}
        >
          <Switch
            style={onSwitch}
            onValueChange={this.setEnabled}
            onTintColor={uiTheme.palette.primaryColor}
            thumbTintColor={uiTheme.palette.defaultTextInputBorderColor}
            value={enabled}
          />
          <View
            style={[row, subContainer]}
          >
          <DatePicker
            style={timePicker}
            date={time}
            androidMode="spinner"
            mode="time"
            format="hh:mm"
            confirmBtnText="Ok"
            cancelBtnText="Cancel"
            is24Hour
            customStyles={{
              dateInput: {
                marginLeft: 36
              }
            }}
            iconComponent={
              <Icon
                style={timePickerIcon}
                name='access-time'
                size={24}
              />
            }
            onDateChange={this.setTime}
          />
          <Icon
            style={timeoutIcon}
            name='timer'
            size={24}
          />
          <TimerPicker
            value={timeout}
            onSelect={this.setTimeout}
          />
        </View>
        <WeekDays
          days={days}
          onChange={this.setWeekDay}
        />
        <Volume
          value={volume}
          onChange={this.setVolume}
        />
        <Preset
          type={presetType}
          preset={preset}
          presets={presets[data.presetType]}
          onChangeType={this.setPresetType}
          onChange={this.setPreset}
        />
      </View>
    );
  }
}

const propTypes = {
  data: PropTypes.object.isRequired,
  presets: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

Alarm.propTypes = propTypes;
export default Alarm;
