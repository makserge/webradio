import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  AsyncStorage
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
       [SERVER_HOST]: DEFAULT_SERVER_HOST
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

  openServerHostEdit() {
    this.setState({
      newHostValue: this.state[SERVER_HOST],
      editServerHostMode: true
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

  handleServerHostChange = value => {
    this.setState({
      newHostValue: value
    });
    this.showEmptyValueError('newHostValue', value, 'hostError', i18n.t('serverHost.emptyError'));
  }

  handleServerHostPress = (action) => {
    const {
      newHostValue,
    } = this.state;
    if (action === 'Ok') {
      if (this.checkEmptyValue(newHostValue)) {
        this.showEmptyValueError('newHostValue', newHostValue, 'hostError',
          i18n.t('serverHost.emptyError'));
        return;
      }
      this.setState({ [SERVER_HOST]: newHostValue });
      AsyncStorage.setItem(SERVER_HOST, newHostValue);
    }
    this.setState({
      hostError: '',
      editServerHostMode: false
    });
  }

  render() {
    const {
      editServerHostMode,
      newHostValue,
      hostError
    } = this.state;
    const {
      navigation,
      appState,
      presets,
      actions
    } = this.props;
    return (
      <Container
        title={i18n.t('title.settings')}
        navigation={navigation}
        appState={appState}
        actions={actions}
        editItemDialog={editServerHostMode ?
          <EditValueDialog
            dialogTitle={i18n.t('serverHost.title')}
            label={i18n.t('serverHost.host')}
            value={newHostValue}
            onChange={this.handleServerHostChange}
            error={hostError}
            onBlur={
              () => this.showEmptyValueError('newHostValue', newHostValue, 'hostError',
              i18n.t('serverHost.emptyError'))
            }
            onActionPress={this.handleServerHostPress}
          />
          :
          null
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
              value={this.state[SERVER_HOST]}
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
            data={appState.alarms}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) =>
              <View
                key={item.id}
              >
                <Subheader
                  text={item.title}
                />
                <Alarm
                  data={item}
                  presets={presets}
                  onChange={(data) => actions.setAlarm(index, data)}
                />
              </View>
            }
          />
        </ScrollView>
      </Container>
    );
  }
}

const propTypes = {
  navigation: PropTypes.object.isRequired,
};

Settings.propTypes = propTypes;

const mapStateToProps = state => ({
  appState: state.appState,
  presets: { network: state.webRadio, fm: state.fmRadio }
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
