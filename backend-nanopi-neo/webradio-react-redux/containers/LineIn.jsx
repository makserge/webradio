import React, { Component } from "react";
import Header from '../components/Header';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from '../src/MaterialUiTheme';

class LineIn extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider
          muiTheme={Theme}>
          <div>
            <Header
              title="Line In"
              subTitle="No controls" />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default LineIn;