/* eslint-disable class-methods-use-this */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import i18n from 'i18next';

import EditItemDialog from '../EditItemDialog';
import uiTheme from '../../../MaterialUiTheme';
import { DAB_CHANNEL_FREQUENCY } from '../../constants/Common';

class EditDabItemDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      titleError: '',
      valueError: '',
      value: '',
      program: '',
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
    this.showEmptyValueError('title', title, 'titleError', i18n.t('editDabRadio.emptyTitleError'));
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
      program,
    } = this.state;
    if (action === 'Ok') {
      if (this.checkEmptyValue(title)) {
        this.showEmptyValueError(
          'title', title, 'titleError',
          i18n.t('editDabRadio.emptyTitleError'),
        );
        return;
      }
      if (this.checkDuplicateTitle(itemId, title)) {
        this.setState({ titleError: i18n.t('editDabRadio.duplicateTitleError') });
        return;
      }
      actions.editItem({
        id: itemId,
        title,
        channel: value,
        program,
      });
    }
    onDismiss();
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
    const { title, program, channel } = item[0];
    this.setState({
      title,
      program,
      value: channel,
    });
  }

  valueElement(program, value) {
    return (
      <View>
        <TextField
          label={i18n.t('editDabRadio.channel')}
          tintColor={uiTheme.palette.primaryColor}
          value={i18n.t('editDabRadio.channelItem', { channel: value, frequency: DAB_CHANNEL_FREQUENCY[value] })}
          editable={false}
        />
        <TextField
          label={i18n.t('editDabRadio.program')}
          tintColor={uiTheme.palette.primaryColor}
          value={program}
          editable={false}
        />
      </View>
    );
  }

  render() {
    const {
      title,
      titleError,
      program,
      value,
      valueError,
    } = this.state;
    const { itemId } = this.props;
    return (
      <EditItemDialog
        dialogTitle={itemId === 0
          ? i18n.t('editDabRadio.addPreset') : i18n.t('editDabRadio.editPreset')}
        titleLabel={i18n.t('editItemTitle')}
        title={title}
        onTitleChange={this.handleTitleChange}
        titleError={titleError}
        onBlurTitle={
          () => this.showEmptyValueError(
            'title', title, 'titleError',
            i18n.t('editDabRadio.emptyTitleError'),
          )
        }
        valueElement={this.valueElement(program, value)}
        valueError={valueError}
        onActionPress={this.handleActionPress}
      />
    );
  }
}

EditDabItemDialog.propTypes = {
  itemId: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default EditDabItemDialog;
