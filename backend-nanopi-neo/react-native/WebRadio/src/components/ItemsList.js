import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SortableListView from 'react-native-sortable-listview';

const SCROLL_RETRY_DELAY = 300;

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
    props.scrollToIndex = this.scrollToIndex;
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
    this.scrollToIndex(props.selectedItem);
  }

  scrollToIndex = (index) => {
    if (!this.sortableListView) {
      return;
    }
    const { layoutMap, scrollValue, listLayout } = this.sortableListView;
    const item = layoutMap[index.toString()];
    if (!item) {
      setTimeout(() => this.scrollToIndex(index), SCROLL_RETRY_DELAY);
      return;
    }
    const isScrollDown = (item.y > (scrollValue + listLayout.height) - 100);
    const isScrollUp = item.y < scrollValue + 100;
    if (isScrollDown || isScrollUp) {
      let offset = 0.2 * listLayout.height;
      if (isScrollUp) {
        offset = -offset;
      }
      this.sortableListView.scrollTo({
        x: 0,
        y: item.y + offset,
        animated: true,
      });
    }
  }

  render() {
    const {
      sort,
      onRowMoved,
      renderRow,
    } = this.props;
    const {
      items,
      order,
    } = this.state;
    return (
      <SortableListView
        ref={(sortableListView) => { this.sortableListView = sortableListView; }}
        disableSorting={!sort}
        data={items}
        order={order}
        onRowMoved={event => onRowMoved(event.from, event.to)}
        renderRow={renderRow}
        rowHasChanged={() => true}
      />
    );
  }
}

ItemsList.propTypes = {
  items: PropTypes.array.isRequired,
  sort: PropTypes.bool.isRequired,
  onRowMoved: PropTypes.func.isRequired,
  renderRow: PropTypes.func.isRequired,
  selectedItem: PropTypes.number.isRequired,
};

export default ItemsList;
