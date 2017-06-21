import React, { PropTypes, PureComponent } from 'react';
import {
  Text,
  View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Container from '../components/Container';
import * as itemsActions from '../actions/AppState';

class AirPlay extends PureComponent {
  render() {
    const {
      navigation,
      actions,
      appState
    } = this.props;

    return (
      <Container
        title="AirPlay"
        navigation={navigation}
        appState={appState}
        actions={actions}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{ fontSize: 20 }}
          >
            AirPlay mode
          </Text>
        </View>
      </Container>
    );
  }
}

const propTypes = {
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch)
});

AirPlay.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(AirPlay);
