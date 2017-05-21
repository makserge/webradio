import React, { PropTypes } from 'react';
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
import TimerPicker from '../settings/TimerPicker';
import uiTheme from '../../../MaterialUiTheme';

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

const WeekDays = ({ days }) =>
  <View
    style={styles.subContainer}
  >
    <View
      style={styles.row}
    >
      <Checkbox
        label="Mon"
        checked={days.includes(1)}
        value="1"
      />
      <Checkbox
        label="Tue"
        checked={days.includes(2)}
        value="2"
      />
      <Checkbox
        label="Wed"
        checked={days.includes(3)}
        value="3"
      />
    </View>
    <View
      style={styles.row}
    >
      <Checkbox
        label="Thu"
        checked={days.includes(4)}
        value="4"
      />
      <Checkbox
        label="Fri"
        checked={days.includes(5)}
        value="5"
      />
      <Checkbox
        label="Sat"
        checked={days.includes(6)}
        value="6"
      />
    </View>
    <View
      style={styles.row}
    >
      <Checkbox
        label="Sun"
        checked={days.includes(7)}
        value="7"
      />
  </View>
</View>;

const Volume = ({ value }) =>
  <View
    style={[styles.row, styles.subContainer]}
  >
    <Icon
      style={styles.volumeIcon}
      name="volume-mute"
      size={24}
    //onPress={onVolumeMutePress}
    />
    <Slider
      style={styles.slider}
      value={value}
      minimumValue={0}
      maximumValue={32}
      step={1}
    //onValueChange={(value) => onVolumeChange(value)}
    />
    <Text
      style={styles.volumeValue}
    >
      {value}
    </Text>
  </View>;

const Preset = ({ type, preset, presets }) =>
  <View
    style={[styles.row, styles.subContainer]}
  >
    <RadioButton
      checked={type === 'network'}
      uncheckedIcon="router"
      checkedIcon="router"
      value="network"
    />
    <RadioButton
      checked={type === 'fm'}
      uncheckedIcon="radio"
      checkedIcon="radio"
      value="fmradio"
    />
    <Picker
      style={styles.preset}
      mode="dropdown"
      selectedValue={preset}
    //onValueChange={props.onSelect}
    >
      {presets.map(item => <Picker.Item key={item.id} label={item.name} value={item.id} />)}
    </Picker>
  </View>;

const Alarm = (props) => {
  const presets = {
    network: [{ id: 1, name: 'Stream 1' }, { id: 2, name: 'Stream 2' }],
    fm: [{ id: 1, name: 'Preset 1' }, { id: 2, name: 'Preset 2' }]
  };
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
    data
  } = props;
  return (
    <View
      style={container}
    >
      <Switch
        style={onSwitch}
        onValueChange={(value) => console.log(value)}
        onTintColor={uiTheme.palette.primaryColor}
        thumbTintColor={uiTheme.palette.defaultTextInputBorderColor}
        value={data.enabled}
      />
      <View
        style={[row, subContainer]}
      >
        <DatePicker
          style={timePicker}
          date={data.time}
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
          //onDateChange={(date) => {this.setState({date: date})}}
        />
        <Icon
          style={timeoutIcon}
          name='timer'
          size={24}
        />
        <TimerPicker
          value={`${data.timeout}`}
          onSelect={(value) => console.log(value)}
        />
      </View>
      <WeekDays
        days={data.days}
      />
      <Volume
        value={data.volume}
      />
      <Preset
        type={data.presetType}
        preset={data.preset}
        presets={presets[data.presetType]}
      />
    </View>
  );
};

const propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

Alarm.propTypes = propTypes;
export default Alarm;
