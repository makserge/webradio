import React, { PropTypes } from 'react';
import {
  Picker
} from 'react-native';

const Item = Picker.Item;

const TimerPicker = (props) =>
  <Picker
    style={{ width: 100 }}
    mode="dropdown"
    selectedValue={props.value}
    onValueChange={props.onSelect}
  >
    <Item label="15 min." value="15" />
    <Item label="30 min." value="30" />
    <Item label="45 min." value="45" />
    <Item label="60 min." value="60" />
    <Item label="75 min." value="75" />
    <Item label="90 min." value="90" />
    <Item label="105 min." value="105" />
    <Item label="120 min." value="120" />
    <Item label="135 min." value="135" />
    <Item label="150 min." value="150" />
    <Item label="165 min." value="165" />
    <Item label="180 min." value="180" />
  </Picker>;

const propTypes = {
  value: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

TimerPicker.propTypes = propTypes;
export default TimerPicker;
