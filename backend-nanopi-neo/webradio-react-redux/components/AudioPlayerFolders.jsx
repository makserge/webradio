import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import ImageAudiotrack from 'material-ui/svg-icons/image/audiotrack';
import FileFolderOpen from 'material-ui/svg-icons/file/folder-open';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/AudioPlayerFolders';

const defaultStyle = {
  width: "98%",
  marginLeft: 20
};

class AudioPlayerFolders extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      addItemError: false
    }
  }

  mapStructure = (nodes) => {
    if (nodes) {
      return nodes.map(node => (
        <ListItem
          key={node.id}
          primaryText={node.primaryText}
          secondaryText={node.type === 'folder' ? (<span>Tracks: {node.tracks}</span>) : (<span>{node.codec}, {node.bitrate} kbps</span>)}
          leftIcon={node.type === 'folder' ? (<FileFolderOpen />) : (<ImageAudiotrack />)}
          initiallyOpen={true}
          nestedItems={this.mapStructure(node.children)}
        />
      ));
    }
  };

  render() {
    const { AudioPlayerFolders, actions } = this.props;

    return (
      <section
        className="main"
        style={defaultStyle}>
        <List>
          {this.mapStructure(AudioPlayerFolders)}
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
