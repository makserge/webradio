import React, { PropTypes, PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import uiTheme from '../../../MaterialUiTheme';
import EditItemDialog from '../../components/EditItemDialog';
import FolderTree from '../../components/FolderTree';

const folders = [{
        title: '/',
        children: [
            {
              title: 'Folder1',
            },
            {
              title: 'Folder2',
            },
            {
              title: 'Folder3',
              children: [
                {
                  title: 'Subfolder1',
                },
                {
                  title: 'Subfolder2',
                },
                {
                  title: 'Subfolder3',
                }
              ]
            }
        ]
    }
];

const styles = StyleSheet.create({
  folderLabel: {
    fontSize: 13,
    top: 36,
    color: uiTheme.palette.defaultTextLabelColor
  },
  folderTree: {
    marginTop: 50,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: uiTheme.palette.defaultTextLabelColor
  }
});

const valueElement = (style, value, onFolderChanged) => (
  <View>
    <Text
      style={style.folderLabel}
    >
      Folder
    </Text>
    <View
      style={styles.folderTree}
    >
      <FolderTree
        folders={folders}
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

  handleTitleChange = title => {
    this.setState({ title });
    this.showEmptyValueError('title', title, 'titleError', 'Item title can\'t be empty');
  }

  handleValueChange = value => {
    this.setState({
      value,
      valueError: '',
    });
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
        this.showEmptyValueError('title', title, 'titleError', 'Item title can\'t be empty');
        this.showEmptyValueError('value', value, 'valueError', 'Item folder should be selected');
        return;
      }
      if (this.checkDuplicateTitle(itemId, title)) {
        this.setState({ titleError: 'Item with such title already exists' });
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
    return (
      <EditItemDialog
        dialogTitle={this.props.itemId === 0 ? 'Add playlist' : 'Edit playlist'}
        titleLabel="Title"
        title={title}
        onTitleChange={this.handleTitleChange}
        titleError={titleError}
        onBlurTitle={
          () => this.showEmptyValueError('title', title, 'titleError',
          'Item title can\'t be empty')
        }
        valueElement={valueElement(styles, value, this.handleValueChange)}
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

EditAudioPlaylistItemDialog.propTypes = propTypes;
export default EditAudioPlaylistItemDialog;
