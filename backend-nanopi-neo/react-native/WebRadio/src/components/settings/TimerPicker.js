import React from 'react';
import PropTypes from 'prop-types';
import {
  Picker
} from 'react-native';
import i18n from 'i18next';

const Item = Picker.Item;

/* eslint-disable import/no-named-as-default-member */
const TimerPicker = (props) =>
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
    <Item label={i18n.t('timePicker.105min')} value={105} />
    <Item label={i18n.t('timePicker.120min')} value={120} />
    <Item label={i18n.t('timePicker.135min')} value={135} />
    <Item label={i18n.t('timePicker.150min')} value={150} />
    <Item label={i18n.t('timePicker.165min')} value={165} />
    <Item label={i18n.t('timePicker.180min')} value={180} />
  </Picker>;

const propTypes = {
  value: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

TimerPicker.propTypes = propTypes;
export default TimerPicker;
