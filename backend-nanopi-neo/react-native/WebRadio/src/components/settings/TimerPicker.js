import React from 'react';
import PropTypes from 'prop-types';
import {
  Item,
  Picker,
} from 'react-native';
import i18n from 'i18next';

/* eslint-disable import/no-named-as-default-member */
const TimerPicker = props => (
  <Picker
    style={{ width: 100 }}
    mode="dropdown"
    selectedValue={props.value}
    onValueChange={props.onSelect}
  >
    <Item label={i18n.t('timePicker.15min')} value={15} />
    <Item label={i18n.t('timePicker.30min')} value={30} />
    <Item label={i18n.t('timePicker.45min')} value={45} />
    <Item label={i18n.t('timePicker.60min')} value={60} />
    <Item label={i18n.t('timePicker.75min')} value={75} />
    <Item label={i18n.t('timePicker.90min')} value={90} />
  </Picker>);

TimerPicker.propTypes = {
  value: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
};

TimerPicker.defaultProps = {
  value: null,
};

export default TimerPicker;
