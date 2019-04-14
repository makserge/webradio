import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ItemsList from '../ItemsList';
import DabListItem from './DabListItem';
import * as itemsActions from '../../actions/Radio';

const CHECK_EDIT_MODE_DELAY = 1000;
const EDIT_MODE = 0;
const SORT_MODE = 1;
const DELETE_MODE = 2;

/* eslint-disable import/no-named-as-default-member */
class DabRadio extends PureComponent {
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

  componentWillMount() {
    const { items } = this.props;
    this.checkEditModeTimer = setTimeout(() => {
      if (items.length === 0) {
        this.setState({
          isEditMode: true,
        });
      }
    }, CHECK_EDIT_MODE_DELAY);
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.checkEditModeTimer);
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
      <ItemsList
        items={items}
        sort={isSortMode}
        selectedItem={appState.selectedFmRadioId}
        renderRow={item => (
          <DabListItem
            item={item}
            isSelected={(item.id === appState.selectedFmRadioId && !isSortMode)}
            isSortMode={isSortMode}
            isEditMode={isEditMode}
            onSelect={() => actions.selectItem(item.id)}
            onItemLongPress={() => this.onItemLongPress()}
            onContextMenuPress={action => this.onContextMenuPress(actions, item.id, action)}
          />
        )}
        onRowMoved={this.handleRowMoved}
      />
    );
  }
}

DabRadio.propTypes = {
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.radio,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DabRadio);
