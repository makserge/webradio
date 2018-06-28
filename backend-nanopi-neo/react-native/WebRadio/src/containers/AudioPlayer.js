import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  COLOR,
  ActionButton,
} from 'react-native-material-ui';
import BottomNavigation, { FullTab } from 'react-native-material-bottom-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import i18n from 'i18next';

import Container from '../components/Container';
import EditAudioPlaylistItemDialog from '../components/audioplayer/EditAudioPlaylistItemDialog';
import PickAudioPlaylistItemDialog from '../components/audioplayer/PickAudioPlaylistItemDialog';
import AudioPlayList from '../components/audioplayer/AudioPlayList';
import AudioTrack from '../components/audioplayer/AudioTrack';
import AudioFolder from '../components/audioplayer/AudioFolder';

import * as itemsActions from '../actions/AudioPlayList';
import uiTheme from '../../MaterialUiTheme';

const CHECK_EDIT_MODE_DELAY = 1000;
const TRACKS_TAB = 'tracks';
const PLAYLISTS_TAB = 'playlists';
const FOLDERS_TAB = 'folders';

class AudioPlayer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      openChangePlaylistItem: false,
      openAddToExistingPlaylistItem: false,
      editPlaylistId: 0,
      selectedTab: props.appState.selectedAudioTab,
      isEditMode: false,
      addFolder: '',
    };
  }

  componentWillMount() {
    this.checkEditModeTimer = setTimeout(() => {
      if (this.props.items.length === 0) this.setState({ isEditMode: true });
    }, CHECK_EDIT_MODE_DELAY);
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
      selectedTab: props.appState.selectedAudioTab,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.checkEditModeTimer);
  }

  onAddToPlaylist = (folder, isExisting) => {
    if (isExisting) {
      this.setState({
        addFolder: folder,
        openAddToExistingPlaylistItem: true,
      });
    } else {
      this.setState({
        addFolder: folder,
        openChangePlaylistItem: true,
      });
    }
  }

  onEditPlaylist = (id) => {
    this.setState({
      editPlaylistId: id,
      openChangePlaylistItem: true,
    });
  }

  onItemLongPress = () => {
    if (this.state.isSortMode) {
      return;
    }
    this.setState({
      isEditMode: !this.state.isEditMode,
    });
  }

  handleChangeTab = (tab) => {
    this.props.actions.selectAudioTab(tab.key);
  };

  tabs = [
    {
      key: TRACKS_TAB,
      label: i18n.t('audioPlayer.tracksTab'),
      barColor: uiTheme.palette.primaryColor,
      icon: 'audiotrack',
    },
    {
      key: PLAYLISTS_TAB,
      label: i18n.t('audioPlayer.playlistsTab'),
      barColor: uiTheme.palette.primaryColor,
      icon: 'playlist-play',
    },
    {
      key: FOLDERS_TAB,
      label: i18n.t('audioPlayer.foldersTab'),
      barColor: uiTheme.palette.primaryColor,
      icon: 'folder',
    },
  ];

  renderEditItemDialog = (
    selectedTab,
    editPlaylistId,
    items,
    addFolder,
    openChangePlaylistItem,
    openAddToExistingPlaylistItem,
  ) => {
    if (selectedTab === PLAYLISTS_TAB && openChangePlaylistItem) {
      return (
        <EditAudioPlaylistItemDialog
          itemId={editPlaylistId}
          items={items}
          actions={this.props.actions}
          onDismiss={() => {
            this.setState({
                editPlaylistId: 0,
                openChangePlaylistItem: false,
              });
          }}
        />);
    } else if (selectedTab === FOLDERS_TAB && openAddToExistingPlaylistItem) {
      return (
        <PickAudioPlaylistItemDialog
          folder={addFolder}
          items={items}
          actions={this.props.actions}
          onDismiss={() => {
            this.setState({
                editPlaylistId: 0,
                openAddToExistingPlaylistItem: false,
              });
          }}
        />);
    } else if (selectedTab === FOLDERS_TAB && openChangePlaylistItem) {
      return (
        <EditAudioPlaylistItemDialog
          itemId={editPlaylistId}
          folder={addFolder}
          items={items}
          actions={this.props.actions}
          onDismiss={() => {
            this.setState({
                editPlaylistId: 0,
                openChangePlaylistItem: false,
              });
          }}
        />);
    }
    return null;
  }

  renderAddItemButton = selectedTab => ((selectedTab === PLAYLISTS_TAB) ?
    <ActionButton
      onPress={() => this.setState({ editPlaylistId: 0, openChangePlaylistItem: true })}
    />
    :
    null);

  renderIcon = icon => ({ isActive }) => (
    <Icon size={24} color={isActive ? uiTheme.palette.accentColor : COLOR.white} name={icon} />
  )

  renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      label={tab.label}
      labelStyle={{ color: isActive ? uiTheme.palette.accentColor : COLOR.white }}
      renderIcon={this.renderIcon(tab.icon)}
    />
  )

  render() {
    const {
      addFolder,
      editPlaylistId,
      isEditMode,
      items,
      openChangePlaylistItem,
      openAddToExistingPlaylistItem,
      selectedTab,
    } = this.state;
    const {
      navigation,
      actions,
      appState,
    } = this.props;
    return (
      <Container
        title={i18n.t('title.audioPlayer')}
        navigation={navigation}
        appState={appState}
        actions={actions}
        editItemDialog={
          this.renderEditItemDialog(
            selectedTab,
            editPlaylistId,
            items,
            addFolder,
            openChangePlaylistItem,
            openAddToExistingPlaylistItem,
          )
        }
        addItemButton={isEditMode ? this.renderAddItemButton(selectedTab) : null}
      >
        <BottomNavigation
          activeTab={selectedTab}
          onTabPress={newTab => this.handleChangeTab(newTab)}
          renderTab={this.renderTab}
          tabs={this.tabs}
        />
        {selectedTab === TRACKS_TAB && <AudioTrack />}
        {selectedTab === PLAYLISTS_TAB &&
          <AudioPlayList
            isEditMode={isEditMode}
            onEditItem={this.onEditPlaylist}
            onItemLongPress={() => this.onItemLongPress()}
          />
        }
        {selectedTab === FOLDERS_TAB &&
          <AudioFolder
            onAddItem={this.onAddToPlaylist}
          />
        }
      </Container>
    );
  }
}

AudioPlayer.propTypes = {
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.audioPlayList,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
