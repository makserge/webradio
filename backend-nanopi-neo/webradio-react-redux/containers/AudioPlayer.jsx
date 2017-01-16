import React, { Component, PropTypes } from "react";
import Header from '../components/Header';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from '../src/MaterialUiTheme';
import AudioPlayerTracks from '../components/AudioPlayerTracks';
import AudioPlayerPlaylists from '../components/AudioPlayerPlaylists';
import AudioPlayerFolders from '../components/AudioPlayerFolders';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/AudioPlayer';

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
    const { AudioPlayer, actions } = this.props;

    let tab;
    if (this.state.selectedTab === 'tracks') {
      tab = (
        <AudioPlayerTracks />
      );
    }
    else if (this.state.selectedTab === 'playlists') {
      tab = (
        <AudioPlayerPlaylists
          items={AudioPlayer}
          actions={actions} />
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

AudioPlayer.propTypes = {
  AudioPlayer: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    AudioPlayer: state.AudioPlayer
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
) (AudioPlayer);
