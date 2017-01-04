import React, { Component, PropTypes } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import * as AudioPlayerActions from '../actions/audioplayer';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../src/material_ui_raw_theme_file'

class AudioPlayer extends Component {
  render() {
    const { items, actions } = this.props;
    return (
      <div>
        <MuiThemeProvider
          muiTheme={theme}>
          <div>
            <Header
              title="Audio Player" />

          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

AudioPlayer.propTypes = {
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
    actions: bindActionCreators(AudioPlayerActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayer);
