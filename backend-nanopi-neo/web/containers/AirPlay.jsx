import React, { Component } from "react";
import Header from '../components/Header';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from '../src/MaterialUiTheme';

class AirPlay extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider
          muiTheme={Theme}>
          <div>
            <Header
              title="AirPlay"
              subTitle="AirPlay mode" />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default AirPlay;
