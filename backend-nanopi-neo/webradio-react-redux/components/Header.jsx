import React, { PropTypes, Component } from 'react';
import TodoTextInput from './TodoTextInput';

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

  handleSave(text) {
    if (text.length !== 0) {
      this.props.addTodo(text);
    }
  }

  render() {
    return (
      <header className="header">
          <AppBar
            title="Webradio"
            onTouchTap={this.handleDrawerOpen} />
          <LeftDrawer
            open={this.state.open}
            onToggleDrawer={this.handleDrawerClose} />
          <h1 style={defaultStyle} >todos</h1>
          <TodoTextInput newTodo
                         onSave={this.handleSave.bind(this)}
                         placeholder="What needs to be done?" />
      </header>
    );
  }
}

Header.propTypes = {
  addTodo: PropTypes.func.isRequired
};

export default Header;
