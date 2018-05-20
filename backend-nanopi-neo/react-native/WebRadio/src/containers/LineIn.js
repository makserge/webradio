import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import i18n from 'i18next';

import Container from '../components/Container';
import * as itemsActions from '../actions/AppState';

/* eslint-disable import/no-named-as-default-member */
class LineIn extends PureComponent {
  render() {
    const {
      navigation,
      actions,
      appState,
    } = this.props;

    return (
      <Container
        title={i18n.t('title.lineIn')}
        navigation={navigation}
        appState={appState}
        actions={actions}
      >
        <View
          style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Text
            style={{ fontSize: 20 }}
          >
            {i18n.t('description.lineIn')}
          </Text>
        </View>
      </Container>
    );
  }
}

LineIn.propTypes = {
  actions: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LineIn);
