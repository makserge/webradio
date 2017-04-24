import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ItemsList from '../../components/ItemsList';
import AudioPlayListItem from './AudioPlayListItem';
import * as itemsActions from '../../actions/AudioPlayList';

class AudioPlayList extends PureComponent {
  constructor(props) {
     super(props);
     this.state = {
       items: this.props.items,
       sortList: this.props.appState.sortAudioPlayList,
     };
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
      sortList: props.appState.sortAudioPlayList
    });
  }

  handleRowMoved = (oldIndex, newIndex) => {
    this.props.actions.sortItem({
      oldIndex,
      newIndex
    });
  }

  render() {
    const {
      actions,
    } = this.props;
    const {
      items,
      sortList
    } = this.state;

    return (
      <ItemsList
        items={items}
        sort={sortList}
        actions={actions}
        renderRow={(item) => (
            <AudioPlayListItem
              item={item}
              actions={actions}
            />
          )
        }
        onRowMoved={this.handleRowMoved}
      />
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.audioPlayList
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayList);
