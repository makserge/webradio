import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import LeftDrawer from './LeftDrawer';

const defaultStyle = {
  marginLeft: 20
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleDrawerOpen = () => this.setState({open: true});

  handleDrawerClose = () => this.setState({open: false});

  render() {
    return (
      <header className="header">
          <AppBar
            title={this.props.title}
            onTouchTap={this.handleDrawerOpen} />
          <LeftDrawer
            open={this.state.open}
            onToggleDrawer={this.handleDrawerClose} />
          <h1 style={defaultStyle}>{this.props.subTitle}</h1>
      </header>
    );
  }
}

export default Header;
