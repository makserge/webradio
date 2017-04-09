import React, { PropTypes, Component } from 'react';
import {
  ActionButton
} from 'react-native-material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Container from '../components/Container';
import ItemsList from '../components/ItemsList';
import AudioPlayListItem from '../components/audioplayer/AudioPlayListItem';
import EditAudioPlaylistItemDialog from '../components/audioplayer/EditAudioPlaylistItemDialog';
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
      navigator,
      route,
      actions,
    } = this.props;
    const {
      openChangeItem,
      editId,
      items,
      sortList
    } = this.state;

    return (
      <Container
        navigator={navigator}
        route={route}
        editItemDialog={openChangeItem ?
          <EditAudioPlaylistItemDialog
            itemId={editId}
            items={items}
            actions={actions}
            onDismiss={() => this.setState({ editId: 0, openChangeItem: false })}
          />
          :
          null
          }
        addItemButton={
          <ActionButton
            onPress={() => this.setState({ editId: 0, openChangeItem: true })}
          />
        }
      >
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
      </Container>
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
