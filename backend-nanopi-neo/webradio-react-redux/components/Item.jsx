import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import ItemInput from './ItemInput';
import { ListItem, IconButton, IconMenu, MenuItem } from 'material-ui';
import { grey400 } from 'material-ui/styles/colors'

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';

const editStyle = {
  marginLeft: 55
};

class Item extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editingTitle: false,
      editingUrl: false
    };
  }

  handleEditTitle () {
    this.setState({ editingTitle: true });
  }

  handleEditUrl () {
    this.setState({ editingUrl: true });
  }

  handleSave(id, title, url) {
    this.props.editItem(id, title, url);
    this.setState({ editingTitle: false, editingUrl: false });
  }

  render() {
    const { item, playItem, deleteItem } = this.props;

    const rightIconMenu = (
      <IconMenu iconButtonElement={
          <IconButton>
            <MoreVertIcon
              color={grey400} />
          </IconButton>
        }
      >
        <MenuItem
          primaryText="Edit title"
          onTouchTap={this.handleEditTitle.bind(this)}/>
        <MenuItem
          primaryText="Edit URL"
          onTouchTap={this.handleEditUrl.bind(this)}/>
        <MenuItem
          primaryText="Delete"
          onTouchTap={() => deleteItem(item.id)}/>
      </IconMenu>
    );

    let element;
    let title = item.title;
    let url = item.url;
    if (this.state.editingTitle) {
      element = (
        <div
          style={editStyle}>
          <ItemInput
            text={title}
            editing={this.state.editingTitle}
            onSave={(title) => this.handleSave(item.id, title, url)} />
          <ListItem
            secondaryText={url} />
        </div>
      );
    }
    else if (this.state.editingUrl) {
      element = (
        <div
          style={editStyle}>
          <ListItem
            primaryText={title} />
          <ItemInput
            text={url}
            editing={this.state.editingUrl}
            onSave={(url) => this.handleSave(item.id, title, url)} />
        </div>
      );
    }
    else {
      element = (
        <ListItem
          primaryText={title}
          secondaryText={url}
          onTouchTap={() => playItem(item.id)}
          leftIcon={item.selected ? <AvPlayArrow /> : <AvPlayArrow color="transparent"/>}
          rightIconButton={rightIconMenu} />
      );
    }

    return (
      <div
        className={classnames({
          url: item.url,
          editingTitle: this.state.editingTitle,
          editingUrl: this.state.editingUrl
        })}>
        {element}
      </div>
    );
  }
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
  editItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  playItem: PropTypes.func.isRequired
};

export default Item;
