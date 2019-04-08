import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  AsyncStorage,
} from 'react-native';
import { Subheader } from 'react-native-material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import i18n from 'i18next';

import Container from '../components/Container';
import ServerHost from '../components/settings/ServerHost';
import TimerPicker from '../components/settings/TimerPicker';
import Alarm from '../components/settings/Alarm';
import * as itemsActions from '../actions/Settings';
import { SERVER_HOST, DEFAULT_SERVER_HOST } from '../constants/Common';
import EditValueDialog from '../components/EditValueDialog';

/* eslint-disable import/no-named-as-default-member */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Settings extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editServerHostMode: false,
      newHostValue: '',
      hostError: '',
      [SERVER_HOST]: DEFAULT_SERVER_HOST,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(SERVER_HOST).then((value) => {
      if (value) {
        this.setState({
          [SERVER_HOST]: value,
          newHostValue: value,
        });
      }
    });
  }

  checkEmptyValue = (value) => {
    return value.trim() === '';
  }

  handleServerHostChange = (value) => {
    this.setState({
      newHostValue: value,
    });
    this.showEmptyValueError('newHostValue', value, 'hostError', i18n.t('serverHost.emptyError'));
  }

  handleServerHostPress = (action) => {
    const {
      newHostValue,
    } = this.state;
    if (action === 'Ok') {
      if (this.checkEmptyValue(newHostValue)) {
        this.showEmptyValueError(
          'newHostValue', newHostValue, 'hostError',
          i18n.t('serverHost.emptyError'),
        );
        return;
      }
      this.setState({ [SERVER_HOST]: newHostValue });
      AsyncStorage.setItem(SERVER_HOST, newHostValue);
    }
    this.setState({
      hostError: '',
      editServerHostMode: false,
    });
  }

  openServerHostEdit() {
    const { [SERVER_HOST]: newHostValue } = this.state;
    this.setState({
      newHostValue,
      editServerHostMode: true,
    });
  }

  showEmptyValueError(key, value, error, message) {
    this.setState({
      [key]: value,
      [error]: this.checkEmptyValue(value) ? message : '',
    });
  }

  render() {
    const {
      [SERVER_HOST]: hostValue,
      editServerHostMode,
      newHostValue,
      hostError,
    } = this.state;
    const {
      navigation,
      appState,
      presets,
      alarms,
      actions,
    } = this.props;
    return (
      <Container
        title={i18n.t('title.settings')}
        navigation={navigation}
        appState={appState}
        actions={actions}
        editItemDialog={editServerHostMode
          ? (
            <EditValueDialog
              dialogTitle={i18n.t('serverHost.title')}
              label={i18n.t('serverHost.host')}
              value={newHostValue}
              onChange={this.handleServerHostChange}
              error={hostError}
              onBlur={
                () => this.showEmptyValueError(
                  'newHostValue', newHostValue, 'hostError',
                  i18n.t('serverHost.emptyError'),
                )
              }
              onActionPress={this.handleServerHostPress}
            />
          )
          : null
          }
      >
        <ScrollView
          style={styles.container}
        >
          <Subheader
            text={i18n.t('settings.server')}
          />
          <View
            style={{ marginLeft: 15 }}
          >
            <ServerHost
              value={hostValue}
              onPress={() => this.openServerHostEdit()}
            />
          </View>
          <Subheader
            text={i18n.t('settings.sleepTimer')}
          />
          <View
            style={{ marginLeft: 10 }}
          >
            <TimerPicker
              value={appState.sleepTimer}
              onSelect={actions.setSleepTimer}
            />
          </View>
          <FlatList
            data={alarms}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View
                key={item.id}
              >
                <Subheader
                  text={item.title}
                />
                <Alarm
                  data={item}
                  presets={presets}
                  onChange={data => actions.setAlarm(index, data)}
                />
              </View>
            )
            }
          />
        </ScrollView>
      </Container>
    );
  }
}

Settings.propTypes = {
  presets: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
  alarms: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  presets: { 0: state.webRadio, 1: state.radio },
  alarms: state.alarm,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
