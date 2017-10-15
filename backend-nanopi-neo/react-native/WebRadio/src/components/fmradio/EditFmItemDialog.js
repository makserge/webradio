import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Slider,
  Text
} from 'react-native';
import {
  COLOR,
  IconToggle,
} from 'react-native-material-ui';
import i18n from 'i18next';

import EditItemDialog from '../../components/EditItemDialog';
import uiTheme from '../../../MaterialUiTheme';

const FREQUENCY_MIN = 87.5;
const FREQUENCY_MAX = 108.0;
const FREQUENCY_STEP = 0.1;

/* eslint-disable import/no-named-as-default-member */
const styles = StyleSheet.create({
  frequencyLabel: {
    fontSize: 13,
    top: 36,
    color: uiTheme.palette.defaultTextLabelColor
  },
  frequencyContainer: {
    marginTop: 45,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  slider: {
    flex: 1,
  },
  frequencyValue: {
    marginLeft: 2,
    width: 40,
    fontSize: 16
  }
});

const valueElement = (style, handleFrequencyDown, value, onFrequencyChange, handleFrequencyUp) => (
  <View>
    <Text
      style={style.frequencyLabel}
    >
      {i18n.t('editFmRadio.frequency')}
    </Text>
    <View
      style={style.frequencyContainer}
    >
      <IconToggle
        key="down"
        name={'remove'}
        color={COLOR.black}
        onPress={handleFrequencyDown}
      />
      <Slider
        style={style.slider}
        value={value}
        minimumValue={FREQUENCY_MIN}
        maximumValue={FREQUENCY_MAX}
        step={FREQUENCY_STEP}
        onValueChange={onFrequencyChange}
      />
      <IconToggle
        key="up"
        name={'add'}
        color={COLOR.black}
        onPress={handleFrequencyUp}
      />
      <Text
        style={style.frequencyValue}
      >
        {value.toFixed(1)}
      </Text>
    </View>
  </View>
);

class EditFmItemDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      titleError: '',
      valueError: '',
      value: FREQUENCY_MIN,
    };
  }

  componentWillMount() {
    if (this.props.itemId) {
      this.fillEditForm(this.props.itemId);
    }
  }

  fillEditForm(itemId) {
    for (const { id, title, value } of this.props.items) {
      if (itemId === id) {
        this.setState({
          title,
          value: parseFloat(value),
        });
        return true;
      }
    }
  }

  handleTitleChange = title => {
    this.setState({ title });
    this.showEmptyValueError('title', title, 'titleError', i18n.t('editFmRadio.emptyTitleError'));
  }

  checkEmptyValue(value) {
    return value.trim() === '';
  }

  showEmptyValueError(key, value, error, message) {
    this.setState({
      [key]: value,
      [error]: this.checkEmptyValue(value) ? message : ''
    });
  }

  checkDuplicateTitle(id, title) {
    for (const item of this.props.items) {
      if (item.id !== id && item.title === title) {
        return true;
      }
    }
    return false;
  }

  checkDuplicateValue(id, value) {
    for (const item of this.props.items) {
      if (item.id !== id && parseFloat(item.value) === parseFloat(value)) {
        return true;
      }
    }
    return false;
  }

  handleActionPress = (action) => {
    const {
      itemId,
      actions,
      onDismiss,
    } = this.props;
    const {
      title,
      value,
    } = this.state;
    if (action === 'Ok') {
      if (this.checkEmptyValue(title)) {
        this.showEmptyValueError('title', title, 'titleError',
          i18n.t('editFmRadio.emptyTitleError'));
        return;
      }
      if (this.checkDuplicateTitle(itemId, title)) {
        this.setState({ titleError: i18n.t('editFmRadio.duplicateTitleError') });
        return;
      }
      if (this.checkDuplicateValue(itemId, value)) {
        this.setState({ valueError: i18n.t('editFmRadio.duplicateFreqError') });
        return;
      }
      const frequency = value.toFixed(1);
      if (itemId === 0) {
        actions.addItem({
          title,
          value: frequency,
        });
      } else {
        actions.editItem({
          id: itemId,
          title,
          value: frequency,
        });
      }
    }
    onDismiss();
  }

  handleFrequencyDown = () => {
    if (this.state.value > FREQUENCY_MIN) {
      const value = parseFloat((this.state.value - FREQUENCY_STEP).toFixed(1));
      this.setState({ value });
    }
  }

  handleFrequencyUp = () => {
    if (this.state.value < FREQUENCY_MAX) {
      const value = parseFloat((this.state.value + FREQUENCY_STEP).toFixed(1));
      this.setState({ value });
    }
  }

  handleFrequencyChange = (value) => {
    this.setState({ value });
  }

  render() {
    const {
      title,
      titleError,
      value,
      valueError
    } = this.state;
    return (
      <EditItemDialog
        dialogTitle={this.props.itemId === 0 ?
          i18n.t('editFmRadio.addPreset') : i18n.t('editFmRadio.editPreset')}
        titleLabel={i18n.t('editItemTitle')}
        title={title}
        onTitleChange={this.handleTitleChange}
        titleError={titleError}
        onBlurTitle={
          () => this.showEmptyValueError('title', title, 'titleError',
          i18n.t('editFmRadio.emptyTitleError'))
        }
        valueElement={valueElement(styles, this.handleFrequencyDown, value,
          this.handleFrequencyChange, this.handleFrequencyUp)}
        valueError={valueError}
        onActionPress={this.handleActionPress}
      />
    );
  }
}

const propTypes = {
  itemId: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

EditFmItemDialog.propTypes = propTypes;
export default EditFmItemDialog;
