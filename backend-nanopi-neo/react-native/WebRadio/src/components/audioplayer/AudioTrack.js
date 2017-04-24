import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';
import AudioTrackItem from './AudioTrackItem';
import * as itemsActions from '../../actions/AudioTrack';

class AudioTrack extends PureComponent {
  constructor(props) {
     super(props);
     this.state = {
       items: this.props.items,
     };
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
    });
  }

  render() {
    const {
      actions,
    } = this.props;
    const {
      items,
    } = this.state;

    return (
      <FlatList
        keyExtractor={(row, rowIndex) => `row${row.id}-${rowIndex}`}
        data={items}
        renderItem={({ index, item }) => (
          <AudioTrackItem
            key={`row-${index}`}
            item={item}
            actions={actions}
          />
        )}
      />
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.audioTrack
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioTrack);
