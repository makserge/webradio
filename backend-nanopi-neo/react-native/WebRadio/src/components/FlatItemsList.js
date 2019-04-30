import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';

class FlatItemsList extends PureComponent {
  componentWillReceiveProps(props) {
    if (props.items.length === 0) {
      return;
    }
    //this.listRef.scrollToIndex({
    //  animated: true,
    //  index: props.selectedItem,
    //});
  }

  render() {
    const {
      items,
      renderItem,
    } = this.props;
    return (
      <FlatList
        ref={(ref) => { this.listRef = ref; }}
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
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
