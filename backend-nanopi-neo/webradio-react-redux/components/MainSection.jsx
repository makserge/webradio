import React, { Component, PropTypes } from 'react';
import Item from './Item';
import { List } from 'material-ui';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

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

class MainSection extends Component {
  constructor(props, context) {
    super(props, context);
  }

  addItem() {
    this.props.actions.addItem('New stream', 'http://wrongurl');
  }

  render() {
    const { items, actions } = this.props;

    return (
      <section
        className="main"
        style={defaultStyle}>
        <List
          className="items-list">
          {items.map(item =>
            <Item
              key={item.id}
              item={item}
              {...actions} />
          )}
        </List>
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
