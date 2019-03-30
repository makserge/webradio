/* eslint-disable class-methods-use-this */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  COLOR,
  IconToggle,
} from 'react-native-material-ui';
import NumberPicker from 'react-native-numberpicker';
import i18n from 'i18next';

import EditItemDialog from '../EditItemDialog';
import uiTheme from '../../../MaterialUiTheme';

const FREQUENCY_MIN = 65.0;
const FREQUENCY_MAX = 108.0;
const FREQUENCY_STEP = 0.1;

/* eslint-disable import/no-named-as-default-member */
const styles = StyleSheet.create({
  frequencyLabel: {
    fontSize: 13,
    top: 36,
    color: uiTheme.palette.defaultTextLabelColor,
  },
  valueContainer: {
    height: 130,
  },
  frequencyContainer: {
    marginTop: 15,
    flex: 1,
    flexDirection: 'row',
  },
  frequencySeek: {
    height: 130,
    paddingTop: 40,
    paddingRight: 15,
  },
  frequencyPicker: {
    width: 100,
    borderWidth: 1,
    borderColor: COLOR.white,
    height: 130,
    marginRight: 20,
  },
});

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
    const { itemId } = this.props;
    if (itemId) {
      this.fillEditForm(itemId);
    }
  }

  handleTitleChange = (title) => {
    this.setState({ title });
    this.showEmptyValueError('title', title, 'titleError', i18n.t('editFmRadio.emptyTitleError'));
  }

  handleSeekDown = () => {

  }

  handleSeekUp = () => {

  }

  checkEmptyValue = (value) => {
    return value.trim() === '';
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
        this.showEmptyValueError(
          'title', title, 'titleError',
          i18n.t('editFmRadio.emptyTitleError'),
        );
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

  handleFrequencyChange = (value) => {
    this.setState({ value: parseFloat(value) });
  }

  checkDuplicateValue(id, value) {
    const { items } = this.props;
    for (const item of items) {
      if (item.id !== id && parseFloat(item.value) === parseFloat(value)) {
        return true;
      }
    }
    return false;
  }

  checkDuplicateTitle(id, title) {
    const { items } = this.props;
    for (const item of items) {
      if (item.id !== id && item.title === title) {
        return true;
      }
    }
    return false;
  }

  showEmptyValueError(key, value, error, message) {
    this.setState({
      [key]: value,
      [error]: this.checkEmptyValue(value) ? message : '',
    });
  }

  fillEditForm(itemId) {
    const { items } = this.props;
    const item = items.filter(element => itemId === element.id);
    const { title, value } = item[0];
    this.setState({
      title,
      value: parseFloat(value),
    });
  }

  valueElement(value) {
    const values = [];
    let selectedIndex = 0;
    let index = 0;
    for (let i = FREQUENCY_MIN; i <= FREQUENCY_MAX; i += FREQUENCY_STEP) {
      const item = i.toFixed(1);
      values.push(item);
      if (parseFloat(item) === value) {
        selectedIndex = index;
      }
      index++;
    }
    return (
      <View
        style={styles.valueContainer}
      >
        <View
          style={styles.frequencyContainer}
        >
          <View
            style={styles.frequencySeek}
          >
            <IconToggle
              key="skip-previous"
              name="skip-previous"
              color={COLOR.black}
              onPress={this.handleSeekDown}
            />
          </View>
          <View
            style={styles.frequencyPicker}
          >
            <NumberPicker
              style={styles.frequencyPicker}
              height={130}
              values={values}
              selected={selectedIndex}
              onSelect={selection => this.handleFrequencyChange(values[selection])}
            />
          </View>
          <View
            style={styles.frequencySeek}
          >
            <IconToggle
              key="skip-next"
              name="skip-next"
              color={COLOR.black}
              onPress={this.handleSeekUp}
            />
          </View>
        </View>
      </View>);
  }

  render() {
    const {
      title,
      titleError,
      value,
      valueError,
    } = this.state;
    const { itemId } = this.props;
    return (
      <EditItemDialog
        dialogTitle={itemId === 0
          ? i18n.t('editFmRadio.addPreset') : i18n.t('editFmRadio.editPreset')}
        titleLabel={i18n.t('editItemTitle')}
        title={title}
        onTitleChange={this.handleTitleChange}
        titleError={titleError}
        onBlurTitle={
          () => this.showEmptyValueError(
            'title', title, 'titleError',
            i18n.t('editFmRadio.emptyTitleError'),
          )
        }
        valueElement={this.valueElement(value)}
        valueError={valueError}
        onActionPress={this.handleActionPress}
      />
    );
  }
}

EditFmItemDialog.propTypes = {
  itemId: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default EditFmItemDialog;
