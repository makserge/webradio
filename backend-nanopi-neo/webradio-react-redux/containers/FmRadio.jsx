import React, { Component, PropTypes } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as Actions from '../actions/FmRadio';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from '../src/MaterialUiTheme';

class FmRadio extends Component {
  render() {
    const { FmRadio, actions } = this.props;
    return (
      <div>
        <MuiThemeProvider
          muiTheme={Theme}>
          <div>
            <Header
              title="FM Radio" />
              <MainSection
                items={FmRadio}
                actions={actions}
                type="fm" />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

FmRadio.propTypes = {
  FmRadio: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    FmRadio: state.FmRadio
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect (
  mapStateToProps,
  mapDispatchToProps
) (FmRadio);
