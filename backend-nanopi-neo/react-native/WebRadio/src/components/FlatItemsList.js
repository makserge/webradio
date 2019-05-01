import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';

class FlatItemsList extends PureComponent {
  componentWillReceiveProps(props) {
    if (props.items.length === 0) {
      return;
    }
    if (this.listRef && props.selectedItem > 0) {
      this.listRef.scrollToIndex({
        animated: true,
        index: props.selectedItem - 1,
      });
    }
  }

  render() {
    const {
      items,
      renderItem,
      selectedItem,
    } = this.props;
    return (
      <FlatList
        ref={(ref) => { this.listRef = ref; }}
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        initialScrollIndex={selectedItem - 1}
      />
    );
  }
}

FlatItemsList.defaultProps = {
  selectedItem: 0,
};

FlatItemsList.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.number,
};

export default FlatItemsList;
