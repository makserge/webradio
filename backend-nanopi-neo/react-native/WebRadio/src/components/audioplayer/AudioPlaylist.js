import React, { PropTypes, Component } from 'react';
import {
  ActionButton
} from 'react-native-material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Container from '../components/Container';
import ItemsList from '../components/ItemsList';
import AudioPlayListItem from '../components/audioplayer/AudioPlayListItem';
import * as itemsActions from '../actions/AudioPlayer';

class AudioPlayer extends Component {
  state = {
    openChangeItem: false,
    items: this.props.items,
    sortList: this.props.appState.sortAudioPlayList,
    editId: 0
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
      sortList: props.appState.sortAudioPlayList
    });
    if (props.appState.editAudioPlayList) {
      this.setState({
        editId: props.appState.editAudioPlayListId,
        openChangeItem: true,
      });
    }
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

const propTypes = {
  navigator: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.audioPlayer
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch)
});

AudioPlayer.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
