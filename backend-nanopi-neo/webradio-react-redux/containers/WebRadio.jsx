import React, { Component, PropTypes } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as WebradioActions from '../actions/webradio';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../src/material_ui_raw_theme_file'

class WebRadio extends Component {
  render() {
    const { webradio, actions } = this.props;
    return (
      <div>
        <MuiThemeProvider
          muiTheme={theme}>
          <div>
            <Header
              title="Web Radio" />
              <MainSection
                items={webradio}
                actions={actions} />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

WebRadio.propTypes = {
  webradio: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    webradio: state.webradio
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(WebradioActions, dispatch)
  };
}

export default connect (
  mapStateToProps,
  mapDispatchToProps
) (WebRadio);
