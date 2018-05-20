import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  COLOR,
  ActionButton,
} from 'react-native-material-ui';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import i18n from 'i18next';

import Container from '../components/Container';
import EditAudioPlaylistItemDialog from '../components/audioplayer/EditAudioPlaylistItemDialog';
import AudioPlayList from '../components/audioplayer/AudioPlayList';
import AudioTrack from '../components/audioplayer/AudioTrack';
import * as itemsActions from '../actions/AudioPlayList';
import uiTheme from '../../MaterialUiTheme';

const PLAYLISTS_TAB = 0;
const TRACKS_TAB = 1;

/* eslint-disable import/no-named-as-default-member */
class AudioPlayer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      openChangePlaylistItem: false,
      editPlaylistId: 0,
      selectedTab: props.appState.selectedAudioTab,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
      selectedTab: props.appState.selectedAudioTab,
    });
  }

  onEditItem = (id) => {
    this.setState({
      editPlaylistId: id,
      openChangePlaylistItem: true,
    });
  }

  handleChangeTab = (tab) => {
    this.props.actions.selectAudioTab(tab);
  };

  renderAddItemButton = selectedTab => ((selectedTab === PLAYLISTS_TAB) ?
    <ActionButton
      onPress={() => this.setState({ editPlaylistId: 0, openChangePlaylistItem: true })}
    />
    :
    null);

  renderEditItemDialog = (selectedTab, openChangePlaylistItem) => (
    (selectedTab === PLAYLISTS_TAB && openChangePlaylistItem) ?
      <EditAudioPlaylistItemDialog
        itemId={this.state.editPlaylistId}
        items={this.state.items}
        dirTree={this.props.dirTree}
        actions={this.props.actions}
        onDismiss={() => this.setState({ editPlaylistId: 0, openChangePlaylistItem: false })}
      />
      :
      null);

  render() {
    const {
      selectedTab,
      openChangePlaylistItem,
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
        editItemDialog={this.renderEditItemDialog(selectedTab, openChangePlaylistItem)}
        addItemButton={this.renderAddItemButton(selectedTab)}
      >
        <BottomNavigation
          backgroundColor={uiTheme.palette.primaryColor}
          labelColor={COLOR.white}
          activeLabelColor={uiTheme.palette.accentColor}
          style={{ height: 56 }}
          activeTab={selectedTab}
          onTabChange={currentTab => this.handleChangeTab(currentTab)}
        >
          <Tab
            label={i18n.t('audioPlayer.playlistsTab')}
            icon={
              <Icon
                size={24}
                color={selectedTab === PLAYLISTS_TAB ? uiTheme.palette.accentColor : COLOR.white}
                name="playlist-play"
              />
            }
          />
          <Tab
            label={i18n.t('audioPlayer.tracksTab')}
            icon={
              <Icon
                size={24}
                color={this.state.selectedTab === TRACKS_TAB ?
                  uiTheme.palette.accentColor : COLOR.white}
                name="audiotrack"
              />
            }
          />
        </BottomNavigation>
        {selectedTab === PLAYLISTS_TAB && <AudioPlayList onEditItem={this.onEditItem} />}
        {selectedTab === TRACKS_TAB && <AudioTrack />}
      </Container>
    );
  }
}

AudioPlayer.propTypes = {
  dirTree: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.audioPlayList,
  dirTree: state.contentDirTree,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
