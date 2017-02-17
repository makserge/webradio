import React, { Component, PropTypes } from "react";
import Header from '../components/Header';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from '../MaterialUiTheme';
import AudioPlayerTracks from '../components/AudioPlayerTracks';
import AudioPlayerPlaylists from '../components/AudioPlayerPlaylists';
import AudioPlayerFolders from '../components/AudioPlayerFolders';

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    let selectedTab = 'tracks';
    if (this.props.location.pathname === '/audioplayer/playlists') {
      selectedTab = 'playlists';
    }
    else if (this.props.location.pathname === '/audioplayer/folders') {
      selectedTab = 'folders';
    }
    this.state = {
      selectedTab: selectedTab
    };
  }

  onChangeTab = (selectedTab) => {
    this.setState({ selectedTab: selectedTab });
  };

  render() {
    let tab;
    if (this.state.selectedTab === 'tracks') {
      tab = (
        <AudioPlayerTracks />
      );
    }
    else if (this.state.selectedTab === 'playlists') {
      tab = (
        <AudioPlayerPlaylists />
      );
    }
    else {
      tab = (
        <AudioPlayerFolders />
      );
    }

    return (
      <div>
        <MuiThemeProvider
          muiTheme={Theme}>
          <div>
            <Header
              title="Audio Player"
              audioTab={this.state.selectedTab}
              onChangeAudioTab={this.onChangeTab} />
              {tab}
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default AudioPlayer;
