import React, { Component, PropTypes } from 'react';
import Item from './Item';
import { List } from 'material-ui';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import AlertError from 'material-ui/svg-icons/alert/error';

const defaultStyle = {
  width: "98%",
  marginLeft: 20
};

const fabStyle = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed'
};

const AddItemError = () => (
  <div>
    <div className="add-item-error">
      <AlertError className="add-item-error-icon" color="red" />
      <div className="add-item-error-text">
        Item with such title already exists
      </div>
    </div>
  </div>
);

const SortableItem = SortableElement(({item, items, type, actions}) => {
    return (
      <div>
        <Item
          key={item.id}
          item={item}
          items={items}
          type={type}
          {...actions} />
      </div>
    )
});

const SortableList = SortableContainer(({items, type, actions}) => {
	return (
    <List
      className="items-list">
      {items.map((item, index) =>
        <SortableItem
          key={`item-${index}`}
          index={index}
          item={item}
          items={items}
          type={type}
          actions={actions} />
      )}
    </List>
	);
});

class MainSection extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      addItemError: false
    }
  }
  checkDuplicateItem(title) {
    const { items } = this.props;
    for (let key in items) {
      if (items[key].title === title) {
        return false;
      }
    };
    return true;
  }
  addItem() {
    let title;
    let value;
    if (this.props.type === 'web') {
      title = 'New stream';
      value = 'http://wrongurl';
    }
    else {
      title = 'New preset';
      value = '88.0';
    }
    if (this.checkDuplicateItem(title)) {
      this.setState({ addItemError: false });
      this.props.actions.addItem(title, value);
    }
    else {
      this.setState({ addItemError: true });
    }
  }
  onSortEnd = ({oldIndex, newIndex}) => {
    this.props.actions.reorderItem(oldIndex, newIndex);
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ addItemError: false });
  }
  render() {
    const { items, actions } = this.props;

    return (
      <section
        className="main"
        style={defaultStyle}>
        {this.state.addItemError ? <AddItemError /> : ''}
        <SortableList
          className="items-list"
          items={items}
          type={this.props.type}
          actions={actions}
          onSortEnd={this.onSortEnd}
          useDragHandle={true} />
        <FloatingActionButton
          style={fabStyle}
          onTouchTap={this.addItem.bind(this)} >
            <ContentAdd />
        </FloatingActionButton>
      </section>
    );
  }
}

MainSection.propTypes = {
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default MainSection;
