import React, { PropTypes, PureComponent } from 'react';
import {
  Text
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Container from '../components/Container';
import * as itemsActions from '../actions/AppState';

class Bluetooth extends PureComponent {
  render() {
    const {
      navigation,
      actions,
      appState
    } = this.props;

    return (
      <Container
        title="Bluetooth"
        navigation={navigation}
        appState={appState}
        actions={actions}
      >
        <Text>
          Bluetooth
        </Text>
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

Bluetooth.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(Bluetooth);
