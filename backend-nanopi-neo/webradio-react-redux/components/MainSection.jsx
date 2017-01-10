import React, { Component, PropTypes } from 'react';
import Item from './Item';
import { List } from 'material-ui';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import ActionReorder from 'material-ui/svg-icons/action/reorder';

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

const SortableItem = SortableElement(({item, actions}) => {
    return (
      <div>
        <Item
          key={item.id}
          item={item}
          {...actions} />
      </div>
    )
});

const SortableList = SortableContainer(({items, actions}) => {
	return (
    <List
      className="items-list">
      {items.map((item, index) =>
        <SortableItem
          key={`item-${index}`}
          index={index}
          item={item}
          actions={actions} />
      )}
    </List>
	);
});

class MainSection extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      items: this.props.items
    }
  }

  addItem() {
    this.props.actions.addItem('New stream', 'http://wrongurl');
  }
  onSortEnd = ({oldIndex, newIndex}) => {
    let {items} = this.state;

    this.setState({
      items: arrayMove(items, oldIndex, newIndex)
    });
  };
  render() {
    let {items} = this.state;
    const { actions } = this.props;

    return (
      <section
        className="main"
        style={defaultStyle}>
        <SortableList
          className="items-list"
          items={items}
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
