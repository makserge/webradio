import React, { Component } from "react";
import Header from '../components/Header';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from '../MaterialUiTheme';

class LineIn extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider
          muiTheme={Theme}>
          <div>
            <Header
              title="Line In"
              subTitle="Line In mode" />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default LineIn;
