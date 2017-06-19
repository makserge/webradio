import React, { PropTypes, PureComponent } from 'react';
import {
  Text
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Container from '../components/Container';
import * as itemsActions from '../actions/AppState';

class LineIn extends PureComponent {
  render() {
    const {
      navigation,
      actions,
      appState
    } = this.props;

    return (
      <Container
        title="Line In"
        navigation={navigation}
        appState={appState}
        actions={actions}
      >
        <Text>
          LineIn
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

LineIn.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(LineIn);
