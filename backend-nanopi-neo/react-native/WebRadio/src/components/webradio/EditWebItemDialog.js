import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'react-native-material-textfield';
import i18n from 'i18next';

import uiTheme from '../../../MaterialUiTheme';
import EditItemDialog from '../EditItemDialog';

/* eslint-disable import/no-named-as-default-member */
const valueElement = (value, valueError, onChangeText, onBlur) => (
  <TextField
    label="URL"
    tintColor={uiTheme.palette.primaryColor}
    errorColor={uiTheme.palette.accentColor}
    value={value}
    onChangeText={onChangeText}
    onBlur={onBlur}
    error={valueError}
  />
);

class EditWebItemDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      titleError: '',
      value: '',
      valueError: '',
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
    this.showEmptyValueError('title', title, 'titleError', i18n.t('editWebRadio.emptyTitleError'));
  }

  handleValueChange = (value) => {
    this.setState({ value });
    this.showEmptyValueError('value', value, 'valueError', i18n.t('editWebRadio.emptyUrlError'));
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
      if (this.checkEmptyValue(title) || this.checkEmptyValue(value)) {
        this.showEmptyValueError(
          'title', title, 'titleError',
          i18n.t('editWebRadio.emptyTitleError'),
        );
        this.showEmptyValueError(
          'value', value, 'valueError',
          i18n.t('editWebRadio.emptyUrlError'),
        );
        return;
      }
      if (this.checkDuplicateTitle(itemId, title)) {
        this.setState({ titleError: i18n.t('editWebRadio.duplicateTitleError') });
        return;
      }
      if (this.checkValidValue(value)) {
        this.setState({ valueError: i18n.t('editWebRadio.invalidUrlError') });
        return;
      }
      if (this.checkDuplicateValue(itemId, value)) {
        this.setState({ valueError: i18n.t('editWebRadio.duplicateUrlError') });
        return;
      }
      if (itemId === 0) {
        actions.addItem({
          title,
          value,
        });
      } else {
        actions.editItem({
          id: itemId,
          title,
          value,
        });
      }
    }
    onDismiss();
  }

  /* eslint-disable class-methods-use-this */
  checkValidValue(value) {
    const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    return !regex.test(value);
  }

  checkDuplicateValue(id, value) {
    const { items } = this.props;
    for (const item of items) {
      if (item.id !== id && item.value === value) {
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
      value,
    });
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
          ? i18n.t('editWebRadio.addStream') : i18n.t('editWebRadio.editStream')}
        titleLabel={i18n.t('editItemTitle')}
        title={title}
        onTitleChange={this.handleTitleChange}
        titleError={titleError}
        onBlurTitle={
          () => this.showEmptyValueError(
            'title', title, 'titleError',
            i18n.t('editWebRadio.emptyTitleError'),
          )
        }
        valueElement={valueElement(
          value, valueError, this.handleValueChange,
          () => this.showEmptyValueError(
            'value', value, 'valueError',
            i18n.t('editWebRadio.emptyUrlError'),
          ),
        )}
        onActionPress={this.handleActionPress}
      />
    );
  }
}

EditWebItemDialog.propTypes = {
  itemId: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default EditWebItemDialog;
