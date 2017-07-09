import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ActionButton
} from 'react-native-material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Container from '../components/Container';
import ItemsList from '../components/ItemsList';
import FmListItem from '../components/fmradio/FmListItem';
import EditFmItemDialog from '../components/fmradio/EditFmItemDialog';
import * as itemsActions from '../actions/FmRadio';

const EDIT_MODE = 0;
const SORT_MODE = 1;
const DELETE_MODE = 2;

class FmRadio extends PureComponent {
  constructor(props) {
     super(props);
     this.state = {
       openChangeItem: false,
       items: props.items,
       isSortMode: false,
       editId: 0
     };
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
    });
  }

  onContextMenuPress = (actions, id, action) => {
    switch (action) {
      case EDIT_MODE:
        this.setState({
          editId: id,
          openChangeItem: true
        });
        break;
      case SORT_MODE:
        this.setState({
          isSortMode: true
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
      newIndex
    });
    this.setState({
      isSortMode: false
    });
  }

  render() {
    const {
      navigation,
      actions,
      appState
    } = this.props;
    const {
      openChangeItem,
      editId,
      items,
      isSortMode
    } = this.state;

    return (
      <Container
        title="FM Radio"
        navigation={navigation}
        appState={appState}
        actions={actions}
        editItemDialog={openChangeItem ?
          <EditFmItemDialog
            itemId={editId}
            items={items}
            actions={actions}
            onDismiss={() => this.setState({ editId: 0, openChangeItem: false })}
          />
          :
          null
          }
        addItemButton={
          <ActionButton
            onPress={() => this.setState({ editId: 0, openChangeItem: true })}
          />
        }
      >
        <ItemsList
          items={items}
          sort={isSortMode}
          renderRow={(item) => (
              <FmListItem
                item={item}
                isSelected={(item.id === appState.selectedFmRadioId && !isSortMode)}
                isSortMode={isSortMode}
                onSelect={() => actions.selectItem(item.id)}
                onContextMenuPress={(action) => this.onContextMenuPress(actions, item.id, action)}
              />
            )
          }
          onRowMoved={this.handleRowMoved}
        />
      </Container>
    );
  }
}

const propTypes = {
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.fmRadio
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch)
});

FmRadio.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(FmRadio);
