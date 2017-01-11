import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import ItemInput from './ItemInput';
import { ListItem, IconButton, IconMenu, MenuItem } from 'material-ui';
import { grey400 } from 'material-ui/styles/colors';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ActionReorder from 'material-ui/svg-icons/action/reorder';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { SortableHandle } from 'react-sortable-hoc';

const editStyle = {
  marginLeft: 55
};

const DragHandle = SortableHandle(() => <div className="drag-handle"><ActionReorder /></div>);

class Item extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editingTitle: false,
      editingUrl: false,
      reordering: false,
      errorTitle: "",
      errorUrl: ""
    };
  }

  checkDuplicateTitle(id, title) {
    const { items } = this.props;
    for (let key in items) {
      if (items[key].id !== id && items[key].title === title) {
        return true;
      }
    };
    return false;
  }

  checkEmptyValue(value) {
    return value.trim() === "";
  }
  checkDuplicateUrl(id, url) {
    const { items } = this.props;
    for (let key in items) {
      if (items[key].id !== id && items[key].url === url) {
        return true;
      }
    };
    return false;
  }

  handleEditTitle () {
    this.setState({ editingTitle: true });
  }

  handleEditUrl () {
    this.setState({ editingUrl: true });
  }

  handleSave(id, title, url) {
    if (this.checkEmptyValue(title)) {
      this.setState({ errorTitle: "Item title can't be empty" });
    }
    else if (this.checkEmptyValue(url)) {
      this.setState({ errorUrl: "Item URL can't be empty" });
    }
    else if (this.checkDuplicateTitle(id, title)) {
      this.setState({ errorTitle: "Item with such title already exists" });
    }
    else if (this.checkDuplicateUrl(id, url)) {
      this.setState({ errorUrl: "Item with such URL already exists" });
    }
    else {
      this.props.editItem(id, title, url);
      this.setState({ errorTitle: "", errorUrl: "", editingTitle: false, editingUrl: false });
    }
  }

  handleReorder () {
    this.setState({ reordering: true });
  }

  render() {
    const { item, playItem, deleteItem } = this.props;

    let rightIconMenu;
    if (!this.state.reordering) {
      rightIconMenu = (
      <IconMenu iconButtonElement={
          <IconButton>
            <MoreVertIcon
              color={grey400} />
          </IconButton>
        }
      >
        <MenuItem
          primaryText="Edit title"
          leftIcon={<EditorModeEdit />}
          onTouchTap={this.handleEditTitle.bind(this)}/>
        <MenuItem
          primaryText="Edit URL"
          leftIcon={<EditorModeEdit />}
          onTouchTap={this.handleEditUrl.bind(this)}/>
        <MenuItem
            primaryText="Reorder"
            leftIcon={<ActionReorder />}
            onTouchTap={this.handleReorder.bind(this)}/>
        <MenuItem
          primaryText="Delete"
          leftIcon={<ActionDelete />}
          onTouchTap={() => deleteItem(item.id)}/>
      </IconMenu>
      );
    }
    let element;
    let title = item.title;
    let url = item.url;
    if (this.state.editingTitle) {
      element = (
        <div
          style={editStyle}>
          <ItemInput
            text={title}
            errorText={this.state.errorTitle}
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
            errorText={this.state.errorUrl}
            editing={this.state.editingUrl}
            onSave={(url) => this.handleSave(item.id, title, url)} />
        </div>
      );
    }
    else {
      if (this.state.reordering) {
        element = (
          <ListItem
            primaryText={title}
            secondaryText={url}
            leftIcon={<AvPlayArrow color="transparent"/>}
            rightIconButton={<IconMenu iconButtonElement={<DragHandle />} />} />
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
