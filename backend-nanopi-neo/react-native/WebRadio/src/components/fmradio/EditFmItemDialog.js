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
import EditItemDialog from '../../components/EditItemDialog';
import uiTheme from '../../../MaterialUiTheme';

const FREQUENCY_MIN = 87.5;
const FREQUENCY_MAX = 108.0;
const FREQUENCY_STEP = 0.1;

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
      Frequency
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
      value: 87.5,
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
    this.showEmptyValueError('title', title, 'titleError', 'Item title can\'t be empty');
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
      if (this.checkEmptyValue(title)) {
        this.showEmptyValueError('title', title, 'titleError', 'Item title can\'t be empty');
        return;
      }
      if (this.checkDuplicateTitle(itemId, title)) {
        this.setState({ titleError: 'Item with such title already exists' });
        return;
      }
      if (this.checkDuplicateValue(itemId, value)) {
        this.setState({ valueError: 'Item with such Frequency already exists' });
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
      this.setState({ value: this.state.value -= FREQUENCY_STEP });
    }
  }

  handleFrequencyUp = () => {
    if (this.state.value < FREQUENCY_MAX) {
      this.setState({ value: this.state.value += FREQUENCY_STEP });
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
    } = this.state;
    return (
      <EditItemDialog
        dialogTitle={this.props.itemId === 0 ? 'Add preset' : 'Edit preset'}
        titleLabel="Title"
        title={title}
        onTitleChange={this.handleTitleChange}
        titleError={titleError}
        onBlurTitle={
          () => this.showEmptyValueError('title', title, 'titleError',
          'Item title can\'t be empty')
        }
        valueElement={valueElement(styles, this.handleFrequencyDown, value,
          this.handleFrequencyChange, this.handleFrequencyUp)}
        valueError=''
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
