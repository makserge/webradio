import React, { Component, PropTypes } from 'react';
import SortableListView from 'react-native-sortable-listview';
import WebRadioListItem from './WebRadioListItem';

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

class AppList extends Component {
  constructor(props) {
    super(props);
    const [items, order] = map(this.props.items);
    this.state = {
      items,
      order
    };
  }

  componentWillReceiveProps(props) {
    const [items, order] = map(props.items);
    this.setState({
      items,
      order
    });
    if (this.listView) {
      this.listView.forceUpdate();
      this.listView = null;
    }
  }

  renderRow = (item) => <WebRadioListItem item={item} />;

  render() {
    const handleRowMove = (onRowMoved, from, to, obj) => {
      console.log(from, to);
      onRowMoved(from, to);
      this.listView = obj;
    };

    const { sort, onRowMoved } = this.props;
    const { items, order } = this.state;
    return (
      <SortableListView
        disableSorting={!sort}
        data={items}
        order={order}
        onRowMoved={event => {
           handleRowMove(onRowMoved, event.from, event.to, this);
        }}
        renderRow={this.renderRow}
      />
    );
  }
}

const propTypes = {
  items: PropTypes.array.isRequired,
  sort: PropTypes.bool.isRequired,
  onRowMoved: PropTypes.func.isRequired,
};

AppList.propTypes = propTypes;
export default AppList;
