import React, { PropTypes, PureComponent } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  FlatList
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
      presets,
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
