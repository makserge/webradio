import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import i18n from 'i18next';

import uiTheme from '../../../MaterialUiTheme';
import EditItemDialog from '../../components/EditItemDialog';
import FolderTree from '../../components/FolderTree';

/* eslint-disable import/no-named-as-default-member */
const styles = StyleSheet.create({
  folderLabel: {
    fontSize: 13,
    top: 36,
    color: uiTheme.palette.defaultTextLabelColor,
  },
  folderTree: {
    marginTop: 50,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: uiTheme.palette.defaultTextLabelColor,
  },
});

const valueElement = (style, dirTree, value, onFolderChanged) => (
  <View>
    <Text
      style={style.folderLabel}
    >
      {i18n.t('editAudioPlaylist.folder')}
    </Text>
    <View
      style={styles.folderTree}
    >
      <FolderTree
        folders={dirTree}
        folder={value}
        onFolderChanged={onFolderChanged}
      />
    </View>
  </View>
);

class EditAudioPlaylistItemDialog extends PureComponent {
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
    if (this.props.itemId) {
      this.fillEditForm(this.props.itemId);
    }
  }

  fillEditForm(itemId) {
    for (const { id, title, value } of this.props.items) {
      if (itemId === id) {
        this.setState({
          title,
          value,
        });
        return true;
      }
    }
  }

  handleTitleChange = (title) => {
    this.setState({ title });
    this.showEmptyValueError(
      'title', title, 'titleError',
      i18n.t('editAudioPlaylist.emptyTitleError'),
    );
  }

  handleValueChange = (value) => {
    this.setState({
      value,
      valueError: '',
    });
  }

  checkEmptyValue = (value) => {
    return value.trim() === '';
  }

  showEmptyValueError(key, value, error, message) {
    this.setState({
      [key]: value,
      [error]: this.checkEmptyValue(value) ? message : '',
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
      if (item.id !== id && item.value === value) {
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
      if (this.checkEmptyValue(title) || this.checkEmptyValue(value)) {
        this.showEmptyValueError(
          'title', title, 'titleError',
          i18n.t('editAudioPlaylist.emptyTitleError'),
        );
        this.showEmptyValueError(
          'value', value, 'valueError',
          i18n.t('editAudioPlaylist.selectFolderError'),
        );
        return;
      }
      if (this.checkDuplicateTitle(itemId, title)) {
        this.setState({ titleError: i18n.t('editAudioPlaylist.duplicateTitleError') });
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

  render() {
    const {
      title,
      titleError,
      value,
      valueError,
    } = this.state;
    const dirTree = [
      {
        title: '/',
        children: this.props.dirTree,
      }];
    return (
      <EditItemDialog
        dialogTitle={this.props.itemId === 0 ?
          i18n.t('editAudioPlaylist.addPlaylist') : i18n.t('editAudioPlaylist.editPlaylist')}
        titleLabel={i18n.t('editItemTitle')}
        title={title}
        onTitleChange={this.handleTitleChange}
        titleError={titleError}
        onBlurTitle={
          () => this.showEmptyValueError(
            'title', title, 'titleError',
            i18n.t('editAudioPlaylist.emptyTitleError'),
          )
        }
        valueElement={valueElement(styles, dirTree, value, this.handleValueChange)}
        valueError={valueError}
        onActionPress={this.handleActionPress}
      />
    );
  }
}

EditAudioPlaylistItemDialog.propTypes = {
  itemId: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
  dirTree: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default EditAudioPlaylistItemDialog;
