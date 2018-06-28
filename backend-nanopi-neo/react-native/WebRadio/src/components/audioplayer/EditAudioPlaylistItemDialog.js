import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import i18n from 'i18next';
import {
  Checkbox,
} from 'react-native-material-ui';

import EditItemDialog from '../../components/EditItemDialog';
import uiTheme from '../../../MaterialUiTheme';

/* eslint-disable import/no-named-as-default-member */
const styles = StyleSheet.create({
  foldersLabel: {
    fontSize: 13,
    color: uiTheme.palette.defaultTextLabelColor,
  },
});

class EditAudioPlaylistItemDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      titleError: '',
      folders: props.folder ? [props.folder] : [],
      selectedFolders: props.folder ? [props.folder] : [],
    };
  }

  componentWillMount() {
    if (this.props.itemId) {
      this.fillEditForm(this.props.itemId);
    }
  }

  onFolderCheck = (item, state) => {
    const items = this.state.selectedFolders;
    let newSelection;
    if (state) {
      newSelection = [
        ...items,
        item,
      ];
    } else {
      newSelection = items.filter(element => item !== element);
    }
    this.setState({
      selectedFolders: newSelection,
    });
  }

  fillEditForm(itemId) {
    const item = this.props.items.filter(element => itemId === element.id);
    const { title, folders } = item[0];
    this.setState({
      title,
      folders,
      selectedFolders: folders,
    });
  }

  handleTitleChange = (title) => {
    this.setState({ title });
    this.showEmptyValueError(
      'title', title, 'titleError',
      i18n.t('editAudioPlaylist.emptyTitleError'),
    );
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

  handleActionPress = (action) => {
    const {
      itemId,
      actions,
      onDismiss,
    } = this.props;
    const {
      title,
      selectedFolders,
    } = this.state;
    if (action === 'Ok') {
      if (this.checkEmptyValue(title)) {
        this.showEmptyValueError(
          'title', title, 'titleError',
          i18n.t('editAudioPlaylist.emptyTitleError'),
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
          folders: selectedFolders,
        });
      } else {
        actions.editItem({
          id: itemId,
          title,
          folders: selectedFolders,
        });
      }
    }
    onDismiss();
  }

  renderFolders = (folders, selectedFolders) => (
    <View>
      <Text
        style={styles.foldersLabel}
      >
        {i18n.t('editAudioPlaylist.folders')}
      </Text>
      <ScrollView>
        {folders.map(item => (
          <Checkbox
            key={item}
            label={item}
            value={item}
            checked={selectedFolders.includes(item)}
            onCheck={state => this.onFolderCheck(item, state)}
          />
        ))
        }
      </ScrollView>
    </View>
  )

  render() {
    const {
      title,
      titleError,
      folders,
      selectedFolders,
    } = this.state;
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
        valueElement={folders.length ? this.renderFolders(folders, selectedFolders) : <View />}
        onActionPress={this.handleActionPress}
      />
    );
  }
}

EditAudioPlaylistItemDialog.propTypes = {
  itemId: PropTypes.number.isRequired,
  folder: PropTypes.string,
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

EditAudioPlaylistItemDialog.defaultProps = {
  folder: null,
};

export default EditAudioPlaylistItemDialog;
