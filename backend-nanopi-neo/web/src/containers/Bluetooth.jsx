import React, { Component } from "react";
import Header from '../components/Header';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from '../MaterialUiTheme';

class Bluetooth extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider
          muiTheme={Theme}>
          <div>
            <Header
              title="Bluetooth"
              subTitle="Bluetooth mode" />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Bluetooth;
