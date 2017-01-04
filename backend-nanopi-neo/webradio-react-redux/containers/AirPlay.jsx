import React, { Component } from "react";
import Header from '../components/Header';

// For Customization Options, edit  or use
// './src/material_ui_raw_theme_file.jsx' as a template.
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../src/material_ui_raw_theme_file'

class AirPlay extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider
          muiTheme={theme}>
          <div>
            <Header
              title="AirPlay"
              subTitle="No controls" />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default AirPlay;
