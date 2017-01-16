import React, { Component, PropTypes } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import * as SettingsActions from '../actions/settings';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from '../src/MaterialUiTheme';

class Settings extends Component {
  render() {
    const { items, actions } = this.props;
    return (
      <div>
        <MuiThemeProvider
          muiTheme={Theme}>
          <div>
            <Header
              title="Settings" />

          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

Settings.propTypes = {
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    items: state.items
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(SettingsActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
