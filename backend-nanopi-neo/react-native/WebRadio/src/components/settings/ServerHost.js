
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableHighlight,
  Text,
  View
} from 'react-native';
import i18n from 'i18next';

import EditValueDialog from '../../components/EditValueDialog';

/* eslint-disable import/no-named-as-default-member */
class ServerHost extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      value: props.value,
      newValue: props.value,
      error: ''
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: props.value
    });
  }

  onPress() {
    this.setState({
      height: 250,
      newValue: this.state.value,
      editMode: true
    });
  }

  checkEmptyValue(value) {
    return value.trim() === '';
  }

  handleActionPress = (action, onSelect) => {
    const {
      newValue,
    } = this.state;
    if (action === 'Ok') {
      if (this.checkEmptyValue(newValue)) {
        this.showEmptyValueError('newValue', newValue, 'error', i18n.t('serverHost.emptyError'));
        return;
      }
      onSelect(newValue);
    }
    this.setState({
      error: '',
      height: 20,
      editMode: false
    });
  }

  showEmptyValueError(key, value, error, message) {
    this.setState({
      [key]: value,
      [error]: this.checkEmptyValue(value) ? message : ''
    });
  }

  handleChange = value => {
    this.setState({ newValue: value });
    this.showEmptyValueError('newValue', value, 'error', i18n.t('serverHost.emptyError'));
  }

  render() {
    const {
      onSelect,
    } = this.props;
    const {
      editMode,
      value,
      newValue,
      error,
      height,
    } = this.state;
    return (
      <View
        style={{ height }}
      >
        <TouchableHighlight
          underlayColor='#dddddd'
          onPress={() => this.onPress()}
        >
          <Text>
            {value}
          </Text>
        </TouchableHighlight>
        {editMode &&
          <EditValueDialog
            dialogTitle={i18n.t('serverHost.title')}
            label={i18n.t('serverHost.host')}
            value={newValue}
            onChange={this.handleChange}
            error={error}
            onBlur={
              () => this.showEmptyValueError('newValue', newValue, 'error',
              i18n.t('serverHost.emptyError'))
            }
            onActionPress={(action) => this.handleActionPress(action, onSelect)}
          />
        }
      </View>
    );
  }
}

const propTypes = {
  value: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

ServerHost.propTypes = propTypes;
export default ServerHost;
