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

import CenteredText from '../CenteredText';
import EditItemDialog from '../EditItemDialog';
import uiTheme from '../../../MaterialUiTheme';

import { FM_FREQUENCY_MIN, FM_FREQUENCY_MAX, FM_FREQUENCY_STEP } from '../../constants/Common';

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
    paddingTop: 42,
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
      value: FM_FREQUENCY_MIN,
    };
  }

  componentWillMount() {
    const { itemId } = this.props;
    if (itemId) {
      this.fillEditForm(itemId);
    }
  }

  componentWillReceiveProps(props) {
    const { value } = this.state;
    if (props.appState.seekFmRadioFrequency !== value) {
      this.setState({
        value: props.appState.seekFmRadioFrequency,
      });
    }
  }

  handleTitleChange = (title) => {
    this.setState({ title });
    this.showEmptyValueError('title', title, 'titleError', i18n.t('editFmRadio.emptyTitleError'));
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

  handleSeek = (actions, direction, value) => {
    const frequency = parseFloat(value.toFixed(1));
    if (direction) {
      actions.seekUp(frequency);
    } else {
      actions.seekDown(frequency);
    }
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

  valueElement(actions, value, isSeekMode) {
    const values = [];
    let selectedIndex = 0;
    let index = 0;
    for (let i = FM_FREQUENCY_MIN; i <= FM_FREQUENCY_MAX; i += FM_FREQUENCY_STEP) {
      const item = i.toFixed(1);
      values.push(item);
      if (parseFloat(item) === value) {
        selectedIndex = index;
      }
      index++;
    }
    return (
      <View style={styles.valueContainer}>
        <View style={styles.frequencyContainer}>
          <View style={styles.frequencySeek}>
            <IconToggle
              key="skip-previous"
              name="skip-previous"
              color={COLOR.black}
              disabled={isSeekMode}
              onPress={() => this.handleSeek(actions, false, value)}
            />
          </View>
          <View style={styles.frequencyPicker}>
            {isSeekMode
              ? (
                <CenteredText
                  text={i18n.t('editFmRadio.seekInProgress')}
                  fontSize={16}
                />
              )
              : (
                <NumberPicker
                  style={styles.frequencyPicker}
                  height={130}
                  values={values}
                  selected={selectedIndex}
                  onSelect={selection => this.handleFrequencyChange(values[selection])}
                />
              )}
          </View>
          <View style={styles.frequencySeek}>
            <IconToggle
              key="skip-next"
              name="skip-next"
              color={COLOR.black}
              disabled={isSeekMode}
              onPress={() => this.handleSeek(actions, true, value)}
            />
          </View>
        </View>
      </View>
    );
  }

  render() {
    const {
      title,
      titleError,
      value,
      valueError,
    } = this.state;
    const {
      itemId,
      appState,
      actions,
    } = this.props;

    const isSeekMode = appState.seekDownFmRadio || appState.seekUpFmRadio;

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
        valueElement={this.valueElement(actions, value, isSeekMode)}
        valueError={valueError}
        onActionPress={this.handleActionPress}
      />
    );
  }
}

EditFmItemDialog.propTypes = {
  itemId: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
  appState: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default EditFmItemDialog;
