import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { ActionButton } from 'react-native-material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import i18n from 'i18next';

import ItemsList from '../ItemsList';
import DabListItem from './DabListItem';
import EditDabItemDialog from './EditDabItemDialog';
import * as itemsActions from '../../actions/DabRadio';
import CenteredText from '../CenteredText';

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
      appState.rescanDabPresets
        ? (
          <CenteredText text={i18n.t('dabRadio.presetsRescanInProgress')} />
        )
        : (
          <View style={{ flex: 1 }}>
            <ItemsList
              items={items}
              sort={isSortMode}
              selectedItem={appState.selectedDabRadioId}
              renderItem={item => (
                <DabListItem
                  item={item}
                  isSelected={(item.id === appState.selectedDabRadioId && !isSortMode)}
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
            && (
              <ActionButton
                icon="sync"
                onPress={() => actions.rescanPresets()}
              />
            )
            }
            {openChangeItem
            && (
              <EditDabItemDialog
                itemId={editId}
                items={items}
                actions={actions}
                onDismiss={() => this.setState({ editId: 0, openChangeItem: false })}
              />
            )
            }
          </View>
        )
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
  items: state.dabRadio,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DabRadio);
