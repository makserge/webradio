import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ItemsList from '../../components/ItemsList';
import AudioPlayListItem from './AudioPlayListItem';
import * as itemsActions from '../../actions/AudioPlayList';

const EDIT_MODE = 0;
const SORT_MODE = 1;
const DELETE_MODE = 2;

class AudioPlayList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      isSortMode: false,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
    });
  }

  onContextMenuPress = (actions, id, onEditItem, action) => {
    switch (action) {
      case EDIT_MODE:
        onEditItem(id);
        break;
      case SORT_MODE:
        this.setState({
          isSortMode: true,
        });
        break;
      case DELETE_MODE:
        actions.deleteItem(id);
        break;
      default:
    }
  }

  handleRowMoved = (oldIndex, newIndex) => {
    this.props.actions.sortItem({
      oldIndex,
      newIndex,
    });
    this.state = {
      isSortMode: false,
    };
  }

  render() {
    const {
      actions,
      appState,
      onEditItem,
      isEditMode,
      onItemLongPress,
    } = this.props;
    const {
      items,
      isSortMode,
    } = this.state;

    return (
      <ItemsList
        items={items}
        sort={isSortMode}
        actions={actions}
        renderRow={item => (
          <AudioPlayListItem
            item={item}
            isSelected={(item.id === appState.selectedAudioPlayListId && !isSortMode)}
            isSortMode={isSortMode}
            isEditMode={isEditMode}
            onItemLongPress={onItemLongPress}
            onSelect={() => actions.selectItem(item.id)}
            onContextMenuPress={action => this.onContextMenuPress(actions, item.id, onEditItem, action)}
          />
          )
        }
        onRowMoved={this.handleRowMoved}
      />
    );
  }
}

AudioPlayList.propTypes = {
  items: PropTypes.array.isRequired,
  appState: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  onEditItem: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  onItemLongPress: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.audioPlayList,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayList);
