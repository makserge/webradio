import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SortableListView from 'react-native-sortable-listview';

const map = (items) => {
  const out = {};
  const order = [];
  if (items) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      out[item.id] = item;
      order.push(item.id);
    }
  }
  return [out, order];
};

class ItemsList extends PureComponent {
  constructor(props) {
    super(props);
    const [items, order] = map(props.items);
    this.state = {
      items,
      order,
    };
  }

  componentWillReceiveProps(props) {
    const [items, order] = map(props.items);
    this.setState({
      items,
      order,
    });
    if (this.listView) {
      this.listView.forceUpdate();
    }
  }

  render() {
    const {
      sort,
      onRowMoved,
      renderRow
    } = this.props;
    const {
      items,
      order,
    } = this.state;
    return (
      <SortableListView
        disableSorting={!sort}
        data={items}
        order={order}
        onRowMoved={event => onRowMoved(event.from, event.to)}
        renderRow={(item) => {
            this.listView = this;
            return renderRow(item);
          }
        }
      />
    );
  }
}

const propTypes = {
  items: PropTypes.array.isRequired,
  sort: PropTypes.bool.isRequired,
  onRowMoved: PropTypes.func.isRequired,
  renderRow: PropTypes.func.isRequired
};

ItemsList.propTypes = propTypes;
export default ItemsList;
