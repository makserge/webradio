import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FlatItemsList from '../FlatItemsList';
import AudioFolderItem from './AudioFolderItem';
import * as itemsActions from '../../actions/AudioFolder';

const ADD_TO_NEW_PLAYLIST_MODE = 0;
const ADD_TO_EXISTING_PLAYLIST_MODE = 1;
const FOLDERS_RESCAN_MODE = 2;

class AudioFolder extends PureComponent {
  constructor(props) {
    super(props);
    const { items } = props;
    this.state = {
      items,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
    });
  }
/*
  onContextMenuPress = (actions, folder, onAddItem, action) => {
    switch (action) {
      case ADD_TO_NEW_PLAYLIST_MODE:
        onAddItem(folder, false);
        break;
      case ADD_TO_EXISTING_PLAYLIST_MODE:
        onAddItem(folder, true);
        break;
      case FOLDERS_RESCAN_MODE:
        actions.rescanFolders();
        break;
      default:
    }
  }
*/

  render() {
    const {
      actions,
    //  onAddItem,\\\\\\
    } = this.props;
    const {
      items,
    } = this.state;
    return (
      <FlatItemsList
        items={items}
        renderRow={item => (
          <AudioFolderItem
            item={item}
            onSelect={() => actions.selectFolder(item.path)}
            onContextMenuPress={(action) => {
              // this.onContextMenuPress(actions, item.path, onAddItem, action);
            }}
          />
        )}
      />
    );
  }
}

AudioFolder.propTypes = {
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
//  onAddItem: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  items: state.audioFolder,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioFolder);
