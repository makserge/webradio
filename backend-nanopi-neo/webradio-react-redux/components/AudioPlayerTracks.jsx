import React, { Component, PropTypes } from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/AudioPlayerTracks';

import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';

const defaultStyle = {
  width: "98%",
  marginLeft: 20
};

class AudioPlayerTracks extends Component {
  constructor(props) {
    super(props);
    this.state = {value: 1};
  }

  handleChangePlaylist = (event, index, value) => {
    this.setState({value});
    console.log("playlist", value);
    this.props.actions.loadTracks(value);
  };

  render() {
    const { AudioPlayerTracks, actions } = this.props;
    const playlists = [
      { id: 1, title: 'Playlist 1' },
      { id: 2, title: 'Playlist 2' },
      { id: 3, title: 'Playlist 3' }
    ];
    return (
      <section
        className="main"
        style={defaultStyle}>
        <DropDownMenu
          value={this.state.value}
          onChange={this.handleChangePlaylist}>
          {playlists.map(playlist =>
            <MenuItem
              value={playlist.id}
              primaryText={playlist.title} />
          )}
        </DropDownMenu>
        <List
          className="items-list">
          {AudioPlayerTracks.map(item =>
            <ListItem
              primaryText={item.title}
              secondaryText={<span>{item.codec}, {item.bitrate} kbps</span>}
              onTouchTap={() => actions.playItem(item.id)}
              leftIcon={item.selected ? <AvPlayArrow /> : <AvPlayArrow color="transparent"/>} />
          )}
        </List>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    AudioPlayerTracks: state.AudioPlayerTracks
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
) (AudioPlayerTracks);
