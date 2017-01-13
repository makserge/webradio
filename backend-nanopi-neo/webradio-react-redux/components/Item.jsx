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
import FrequencySlider from './FrequencySlider';

const editStyle = {
  marginLeft: 55
};
const titleStyle = {
  marginLeft: 20,
  fontSize: 16
};
const valueStyle = {
  marginLeft: 20,
  fontSize: 14
};

const DragHandle = SortableHandle(() => <div className="drag-handle"><ActionReorder /></div>);

class Item extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editingTitle: false,
      editingValue: false,
      reordering: false,
      errorTitle: "",
      errorValue: ""
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
  checkDuplicateValue(id, value) {
    const { items } = this.props;
    for (let key in items) {
      if (items[key].id !== id && items[key].value === value) {
        return true;
      }
    };
    return false;
  }

  handleEditTitle () {
    this.setState({ editingTitle: true });
  }

  handleEditValue () {
    this.setState({ editingValue: true });
  }

  handleSave(id, title, value) {
    if (this.checkEmptyValue(title)) {
      this.setState({ errorTitle: "Item title can't be empty" });
    }
    else if (this.checkEmptyValue(value)) {
      this.setState({ errorValue: this.props.type === "web" ? "Item URL can't be empty" : "Item frequency can't be empty" });
    }
    else if (this.checkDuplicateTitle(id, title)) {
      this.setState({ errorTitle: "Item with such title already exists" });
    }
    else if (this.checkDuplicateValue(id, value)) {
      this.setState({ errorValue: this.props.type === "web" ? "Item with such URL already exists" : "Item with such frequency already exists" });
    }
    else {
      this.props.editItem(id, title, value);
      this.setState({ errorTitle: "", errorValue: "", editingTitle: false, editingValue: false });
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
          primaryText={this.props.type === "web" ? "Edit URL" : "Edit frequency"}
          leftIcon={<EditorModeEdit />}
          onTouchTap={this.handleEditValue.bind(this)}/>
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
    let value = item.value;
    if (this.state.editingTitle) {
      element = (
        <div
          style={editStyle}>
          <ItemInput
            text={title}
            errorText={this.state.errorTitle}
            editing={this.state.editingTitle}
            onSave={(title) => this.handleSave(item.id, title, value)} />
          <span
            style={valueStyle}>
            {value}
          </span>
        </div>
      );
    }
    else if (this.state.editingValue) {
      if (this.props.type === 'web') {
        element = (
          <div
            style={editStyle}>
            <span
              style={titleStyle}>
              {title}
            </span>
            <ItemInput
              text={value}
              errorText={this.state.errorValue}
              editing={this.state.editingValue}
              onSave={(value) => this.handleSave(item.id, title, value)} />
          </div>
        );
      }
      else {
        element = (
          <div
            style={editStyle}>
            <span
              style={titleStyle}>
              {title}
            </span>
            <FrequencySlider
              value={value}
              onSave={(value) => this.handleSave(item.id, title, value)} />
          </div>
        );
      }
    }
    else {
      if (this.state.reordering) {
        element = (
          <ListItem
            primaryText={title}
            secondaryText={value}
            leftIcon={<AvPlayArrow color="transparent"/>}
            rightIconButton={<IconMenu iconButtonElement={<DragHandle />} />} />
        );
      }
      else {
        element = (
        <ListItem
          primaryText={title}
          secondaryText={value}
          onTouchTap={() => playItem(item.id)}
          leftIcon={item.selected ? <AvPlayArrow /> : <AvPlayArrow color="transparent"/>}
          rightIconButton={rightIconMenu} />
        );
      }
    }

    return (
      <div
        className={classnames({
          value: item.value,
          editingTitle: this.state.editingTitle,
          editingValue: this.state.editingValue
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
