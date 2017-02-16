import React, { Component, PropTypes } from 'react';
import { List, ListItem, IconMenu, MenuItem, IconButton } from 'material-ui';
import { grey400 } from 'material-ui/styles/colors';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import AvPlaylistAdd from 'material-ui/svg-icons/av/playlist-add';
import ImageAudiotrack from 'material-ui/svg-icons/image/audiotrack';
import FileFolderOpen from 'material-ui/svg-icons/file/folder-open';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/AudioPlayerFolders';

const defaultStyle = {
  width: "98%",
  marginLeft: 20
};

class AudioPlayerFolders extends Component {

  mapStructure = (nodes, playlists, actions) => {
    if (nodes) {
      return nodes.map(node => (
        <ListItem
          key={node.id}
          primaryText={node.primaryText}
          secondaryText={node.type === 'folder' ? (<span>Tracks: {node.tracks}</span>) : (<span>{node.codec}, {node.bitrate} kbps</span>)}
          leftIcon={node.type === 'folder' ? (<FileFolderOpen />) : (<ImageAudiotrack />)}
          initiallyOpen={true}
          nestedItems={this.mapStructure(node.children, playlists, actions)}
          rightIconButton={node.type === 'folder' ? (
          <IconMenu iconButtonElement={
              <IconButton>
                <MoreVertIcon
                  color={grey400} />
              </IconButton>
              }
            >
            <MenuItem
              primaryText="Play"
              leftIcon={<AvPlayArrow />}
              onTouchTap={() => actions.playFolder(node.id)}/>
            <MenuItem
              primaryText="Add to playlist"
              leftIcon={<AvPlaylistAdd />}
              rightIcon={<ArrowDropRight />}
              menuItems={
                playlists.map(playlist => (
                  <MenuItem
                    primaryText={playlist.title}
                    onTouchTap={() => actions.addFolderToPlaylist(node.id, playlist.id)} />
                ))
              } />
            <MenuItem
              primaryText="Delete"
              leftIcon={<ActionDelete />}
              onTouchTap={() => actions.deleteFolder(node.id)}/>
          </IconMenu>
          ) :
          (
          <IconMenu iconButtonElement={
              <IconButton>
                <MoreVertIcon
                  color={grey400} />
              </IconButton>
              }
            >
            <MenuItem
              primaryText="Play"
              leftIcon={<AvPlayArrow />}
              onTouchTap={() => actions.playTrack(node.id)}/>
            <MenuItem
              primaryText="Add to playlist"
              leftIcon={<AvPlaylistAdd />}
              rightIcon={<ArrowDropRight />}
              menuItems={
                playlists.map(playlist => (
                  <MenuItem
                    primaryText={playlist.title}
                    onTouchTap={() => actions.addTrackToPlaylist(node.id, playlist.id)} />
                ))
              } />
            <MenuItem
              primaryText="Delete"
              leftIcon={<ActionDelete />}
              onTouchTap={() => actions.deleteTrack(node.id)}/>
          </IconMenu>
          )
          }
        />
      ));
    }
  };

  render() {
    const { AudioPlayerFolders, actions } = this.props;
    const playlists = [
      { id: 1, title: 'Playlist 1' },
      { id: 2, title: 'Playlist 2' },
      { id: 3, title: 'Playlist 3' }
    ];

    return (
      <section
        className="main"
        style={defaultStyle}>
        <List>
          {this.mapStructure(AudioPlayerFolders, playlists, actions)}
        </List>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    AudioPlayerFolders: state.AudioPlayerFolders
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect (
  mapStateToProps,
  mapDispatchToProps
) (AudioPlayerFolders);
