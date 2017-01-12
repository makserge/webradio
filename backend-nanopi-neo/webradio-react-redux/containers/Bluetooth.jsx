import React, { Component } from "react";
import Header from '../components/Header';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from '../src/MaterialUiTheme';

class Bluetooth extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider
          muiTheme={Theme}>
          <div>
            <Header
              title="Bluetooth"
              subTitle="No controls" />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Bluetooth;
