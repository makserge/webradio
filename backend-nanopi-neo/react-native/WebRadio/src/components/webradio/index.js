import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { ActionButton } from 'react-native-material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ItemsList from '../ItemsList';
import WebListItem from './WebListItem';
import EditWebItemDialog from './EditWebItemDialog';
import * as itemsActions from '../../actions/WebRadio';

const EDIT_MODE = 0;
const SORT_MODE = 1;
const DELETE_MODE = 2;

class WebRadio extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openChangeItem: false,
      items: props.items,
      isSortMode: false,
      isEditMode: false,
      editId: 0,
    };
  }

  componentWillReceiveProps(props) {
    const { items } = props;
    this.setState({
      items,
      isEditMode: items.length === 0,
    });
  }

  onContextMenuPress = (actions, id, action) => {
    switch (action) {
      case EDIT_MODE:
        this.setState({
          editId: id,
          openChangeItem: true,
        });
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

  onItemLongPress = () => {
    const { isSortMode, isEditMode } = this.state;
    if (isSortMode) {
      return;
    }
    this.setState({
      isEditMode: !isEditMode,
    });
  }

  handleRowMoved = (oldIndex, newIndex) => {
    const { actions } = this.props;
    actions.sortItem({
      oldIndex,
      newIndex,
    });
    this.setState({
      isSortMode: false,
    });
  }

  render() {
    const {
      actions,
      appState,
    } = this.props;
    const {
      openChangeItem,
      editId,
      items,
      isSortMode,
      isEditMode,
    } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <ItemsList
          items={items}
          sort={isSortMode}
          selectedItem={appState.selectedWebRadioId}
          renderItem={item => (
            <WebListItem
              item={item}
              isSelected={(item.id === appState.selectedWebRadioId && !isSortMode)}
              isSortMode={isSortMode}
              isEditMode={isEditMode}
              onSelect={() => actions.selectItem(item.id)}
              onItemLongPress={() => this.onItemLongPress()}
              onContextMenuPress={action => this.onContextMenuPress(actions, item.id, action)}
            />
          )}
          onRowMoved={this.handleRowMoved}
        />
        {isEditMode && !openChangeItem
          && <ActionButton onPress={() => this.setState({ editId: 0, openChangeItem: true })} />
        }
        {openChangeItem
          && (
          <EditWebItemDialog
            itemId={editId}
            items={items}
            actions={actions}
            onDismiss={() => this.setState({ editId: 0, openChangeItem: false })}
          />
          )}
      </View>
    );
  }
}

WebRadio.propTypes = {
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.webRadio,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(WebRadio);
