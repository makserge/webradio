import React, { Component, PropTypes } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as Actions from '../actions/WebRadio';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from '../src/MaterialUiTheme';

class WebRadio extends Component {
  render() {
    const { WebRadio, actions } = this.props;
    return (
      <div>
        <MuiThemeProvider
          muiTheme={Theme}>
          <div>
            <Header
              title="Web Radio" />
              <MainSection
                items={WebRadio}
                actions={actions}
                type="web" />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

WebRadio.propTypes = {
  WebRadio: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    WebRadio: state.WebRadio
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect (
  mapStateToProps,
  mapDispatchToProps
) (WebRadio);
