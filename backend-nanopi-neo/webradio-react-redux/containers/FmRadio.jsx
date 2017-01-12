import React, { Component, PropTypes } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import * as FmradioActions from '../actions/fmradio';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from '../src/MaterialUiTheme';

class FmRadio extends Component {
  render() {
    const { items, actions } = this.props;
    return (
      <div>
        <MuiThemeProvider
          muiTheme={Theme}>
          <div>
            <Header
              title="FM Radio" />

          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

FmRadio.propTypes = {
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    items: state.items
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(FmradioActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FmRadio);
