import React, { Component, PropTypes } from 'react';
import {
  ListView,
} from 'react-native';
import WebRadioListItem from './WebRadioListItem';

class AppList extends Component {
  componentWillMount() {
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      });
      this.dataSource = dataSource.cloneWithRows(this.props.items);
  }

  renderRow = item =>
    <WebRadioListItem
      item={item}
      onRightElementPress={() => console.log('right element press!')}
    />;

  render() {
    return (
      <ListView
        dataSource={this.dataSource}
        renderRow={this.renderRow}
      />
    );
  }
}

const propTypes = {
  items: PropTypes.array.isRequired,
};

AppList.propTypes = propTypes;
export default AppList;
