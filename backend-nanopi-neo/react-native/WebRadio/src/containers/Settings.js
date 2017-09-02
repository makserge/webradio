import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ScrollView,
  View,
  FlatList
} from 'react-native';
import { Subheader } from 'react-native-material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import i18n from 'i18next';

import Container from '../components/Container';
import TimerPicker from '../components/settings/TimerPicker';
import Alarm from '../components/settings/Alarm';
import * as itemsActions from '../actions/Settings';

/* eslint-disable import/no-named-as-default-member */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Settings extends PureComponent {
  render() {
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
      >
        <ScrollView
          style={styles.container}
        >
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
