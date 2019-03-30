import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ActionButton,
} from 'react-native-material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import i18n from 'i18next';

import Container from '../components/Container';
import ItemsList from '../components/ItemsList';
import FmListItem from '../components/fmradio/FmListItem';
import EditFmItemDialog from '../components/fmradio/EditFmItemDialog';
import * as itemsActions from '../actions/FmRadio';

const CHECK_EDIT_MODE_DELAY = 1000;
const EDIT_MODE = 0;
const SORT_MODE = 1;
const DELETE_MODE = 2;

/* eslint-disable import/no-named-as-default-member */
class FmRadio extends PureComponent {
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
      navigation,
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
      <Container
        title={i18n.t('title.fmRadio')}
        navigation={navigation}
        appState={appState}
        actions={actions}
        editItemDialog={openChangeItem
          ? (
            <EditFmItemDialog
              itemId={editId}
              items={items}
              actions={actions}
              onDismiss={() => this.setState({ editId: 0, openChangeItem: false })}
            />
          )
          : null
          }
        addItemButton={isEditMode
          ? (
            <ActionButton
              onPress={() => this.setState({ editId: 0, openChangeItem: true })}
            />
          )
          : null
        }
      >
        <ItemsList
          items={items}
          sort={isSortMode}
          selectedItem={appState.selectedFmRadioId}
          renderRow={item => (
            <FmListItem
              item={item}
              isSelected={(item.id === appState.selectedFmRadioId && !isSortMode)}
              isSortMode={isSortMode}
              isEditMode={isEditMode}
              onSelect={() => actions.selectItem(item.id)}
              onItemLongPress={() => this.onItemLongPress()}
              onContextMenuPress={action => this.onContextMenuPress(actions, item.id, action)}
            />
          )
          }
          onRowMoved={this.handleRowMoved}
        />
      </Container>
    );
  }
}

FmRadio.propTypes = {
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.fmRadio,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FmRadio);
