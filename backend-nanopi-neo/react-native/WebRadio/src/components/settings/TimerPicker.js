import React from 'react';
import PropTypes from 'prop-types';
import {
  Picker,
} from 'react-native';
import i18n from 'i18next';

const TimerPicker = props => (
  <Picker
    style={{ width: 120 }}
    mode="dropdown"
    selectedValue={props.value}
    onValueChange={props.onSelect}
  >
    <Picker.Item label={i18n.t('timePicker.15min')} value={15} />
    <Picker.Item label={i18n.t('timePicker.30min')} value={30} />
    <Picker.Item label={i18n.t('timePicker.45min')} value={45} />
    <Picker.Item label={i18n.t('timePicker.60min')} value={60} />
    <Picker.Item label={i18n.t('timePicker.75min')} value={75} />
    <Picker.Item label={i18n.t('timePicker.90min')} value={90} />
  </Picker>);

TimerPicker.propTypes = {
  value: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
};

TimerPicker.defaultProps = {
  value: 15,
};

export default TimerPicker;
