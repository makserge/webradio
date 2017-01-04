import React, { Component, PropTypes } from 'react';
import Item from './Item';
import { List } from 'material-ui';

const defaultStyle = {
  width: "100%",
  marginLeft: 20
};

class MainSection extends Component {
  constructor(props, context) {
    super(props, context);
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
      </section>
    );
  }
}

MainSection.propTypes = {
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default MainSection;
