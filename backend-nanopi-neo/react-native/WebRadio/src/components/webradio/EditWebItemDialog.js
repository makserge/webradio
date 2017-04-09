import React, { PropTypes, Component } from 'react';
import TextField from 'react-native-md-textinput';
import uiTheme from '../../../MaterialUiTheme';
import EditItemDialog from '../../components/EditItemDialog';

const valueElement = (value, valueError, onChangeText, onBlur) => (
  <TextField
    dense
    label="URL"
    highlightColor={uiTheme.palette.primaryColor}
    borderColor={
      valueError ? uiTheme.palette.accentColor
      : uiTheme.palette.defaultTextInputBorderColor
    }
    value={value}
    onChangeText={onChangeText}
    onBlur={onBlur}
  />
);

class EditWebItemDialog extends Component {
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
    this.setState({ value });
    this.showEmptyValueError('value', value, 'valueError', 'Item URL can\'t be empty');
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
        this.showEmptyValueError('value', value, 'valueError', 'Item URL can\'t be empty');
        return;
      }
      if (this.checkDuplicateTitle(itemId, title)) {
        this.setState({ titleError: 'Item with such title already exists' });
        return;
      }
      if (this.checkDuplicateValue(itemId, value)) {
        this.setState({ valueError: 'Item with such URL already exists' });
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
        dialogTitle={this.props.itemId === 0 ? 'Add stream' : 'Edit stream'}
        titleLabel="Title"
        title={title}
        onTitleChange={this.handleTitleChange}
        titleError={titleError}
        onBlurTitle={
          () => this.showEmptyValueError('title', title, 'titleError',
          'Item title can\'t be empty')
        }
        valueElement={valueElement(value, valueError, this.handleValueChange,
          () => this.showEmptyValueError('value', value, 'valueError',
        'Item URL can\'t be empty'))
        }
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

EditWebItemDialog.propTypes = propTypes;
export default EditWebItemDialog;
