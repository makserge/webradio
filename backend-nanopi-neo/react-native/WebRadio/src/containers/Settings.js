import React, { PropTypes, PureComponent } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import { Subheader } from 'react-native-material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Container from '../components/Container';
import TimerPicker from '../components/settings/TimerPicker';
import Alarm from '../components/settings/Alarm';
import * as itemsActions from '../actions/Settings';

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
      actions
    } = this.props;
    return (
      <Container
        title="Settings"
        navigation={navigation}
        appState={appState}
        actions={actions}
      >
        <ScrollView
          style={styles.container}
        >
          <Subheader
            text="Sleep Timer"
          />
          <View
            style={{ marginLeft: 10 }}
          >
            <TimerPicker
              value={`${appState.sleepTimer}`}
              onSelect={actions.setSleepTimer}
            />
          </View>
          <Subheader
            text="Alarm 1"
          />
          <Alarm
            data={appState.alarms[0]}
            onChange={(data) => actions.setAlarm(0, data)}
          />
          <Subheader
            text="Alarm 2"
          />
          <Alarm
            data={appState.alarms[1]}
            onChange={(data) => actions.setAlarm(1, data)}
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
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
