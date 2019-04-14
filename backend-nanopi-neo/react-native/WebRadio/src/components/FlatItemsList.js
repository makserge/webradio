import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';

class FlatItemsList extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(props) {
    if (props.items.length === 0) {
      return;
    }
    this.listRef.scrollToIndex({
      animated: true,
      index: props.selectedItem,
    });
  }

  render() {
    const {
      items,
      renderRow,
    } = this.props;
    return (
      <FlatList
        ref={(ref) => { this.listRef = ref; }}
        data={items}
        renderRow={renderRow}
        keyExtractor={item => item.id}
      />
    );
  }
}

FlatItemsList.defaultProps = {
  selectedItem: 0,
};

FlatItemsList.propTypes = {
  items: PropTypes.array.isRequired,
  renderRow: PropTypes.func.isRequired,
  selectedItem: PropTypes.number,
};

export default FlatItemsList;
