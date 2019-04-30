import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionButton } from 'react-native-material-ui';
import i18n from 'i18next';

import FlatItemsList from '../FlatItemsList';
import AudioFolderItem from './AudioFolderItem';
import EditAudioPlaylistItemDialog from './EditAudioPlaylistItemDialog';
import PickAudioPlaylistItemDialog from './PickAudioPlaylistItemDialog';
import * as playlistActions from '../../actions/AudioPlayList';
import * as itemsActions from '../../actions/AudioFolder';
import CenteredText from '../CenteredText';

const ADD_TO_NEW_PLAYLIST_MODE = 0;
const ADD_TO_EXISTING_PLAYLIST_MODE = 1;
const FOLDERS_RESCAN_MODE = 2;

class AudioFolder extends PureComponent {
  constructor(props) {
    super(props);
    const { items } = props;
    this.state = {
      items,
      openChangePlaylistItem: false,
      openAddToExistingPlaylistItem: false,
      editPlaylistId: 0,
      addFolder: '',
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
    });
  }

  onContextMenuPress = (actions, folder, action) => {
    switch (action) {
      case ADD_TO_NEW_PLAYLIST_MODE:
        this.setState({
          addFolder: folder,
          openChangePlaylistItem: true,
        });
        break;
      case ADD_TO_EXISTING_PLAYLIST_MODE:
        this.setState({
          addFolder: folder,
          openAddToExistingPlaylistItem: true,
        });
        break;
      case FOLDERS_RESCAN_MODE:
        actions.rescanFolders();
        break;
      default:
    }
  }

  render() {
    const {
      playlistItems,
      actions,
      editActions,
      appState,
    } = this.props;
    const {
      items,
      addFolder,
      editPlaylistId,
      openChangePlaylistItem,
      openAddToExistingPlaylistItem,
    } = this.state;
    return appState.rescanAudioFolders
      ? (
        <CenteredText text={i18n.t('audioFolder.foldersRescanInProgress')} />
      )
      : (
        <View style={{ flex: 1 }}>
          <FlatItemsList
            items={items}
            renderItem={({ item }) => (
              <AudioFolderItem
                item={item}
                onSelect={() => actions.selectFolder(item.path)}
                onContextMenuPress={action => this.onContextMenuPress(actions, item.path, action)}
              />
            )}
          />
          {!openAddToExistingPlaylistItem && !openChangePlaylistItem
            && (
              <ActionButton
                icon="sync"
                onPress={() => actions.rescanFolders()}
              />
            )
            }
          {openAddToExistingPlaylistItem
            && (
            <PickAudioPlaylistItemDialog
              folder={addFolder}
              items={playlistItems}
              actions={editActions}
              onDismiss={() => this.setState({ editPlaylistId: 0, openAddToExistingPlaylistItem: false })}
            />
            )
          }
          {openChangePlaylistItem
            && (
            <EditAudioPlaylistItemDialog
              itemId={editPlaylistId}
              folder={addFolder}
              items={playlistItems}
              actions={editActions}
              onDismiss={() => this.setState({ editPlaylistId: 0, openChangePlaylistItem: false })}
            />
            )
          }
        </View>
      );
  }
}

AudioFolder.propTypes = {
  items: PropTypes.array.isRequired,
  playlistItems: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  editActions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  items: state.audioFolder,
  playlistItems: state.audioPlayList,
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch),
  editActions: bindActionCreators(playlistActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioFolder);
