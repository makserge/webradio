import React, { PropTypes, Component } from 'react';
import {
  ActionButton
} from 'react-native-material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Container from '../components/Container';
import ItemsList from '../components/ItemsList';
import EditStreamDialog from '../components/EditStreamDialog';
import * as itemsActions from '../actions/WebRadio';

class WebRadio extends Component {
  state = {
    openChangeItem: false,
    items: this.props.items,
    sortList: this.props.appState.sortWebradio,
    editId: 0
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
      sortList: props.appState.sortWebradio
    });
    if (props.appState.editWebRadio) {
      this.setState({
        editId: props.appState.editWebRadioId,
        openChangeItem: true,
      });
    }
  }

  handleRowMoved = (oldIndex, newIndex) => {
    this.props.actions.sortItem({
      oldIndex,
      newIndex
    });
  }
  render() {
    const {
      navigator,
      route,
      actions,
      appState
    } = this.props;
    const {
      openChangeItem,
      editId,
      items,
      sortList
    } = this.state;

    return (
      <Container
        navigator={navigator}
        route={route}
        editItemDialog={openChangeItem ?
          <EditStreamDialog
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
          sort={sortList}
          actions={actions}
          onRowMoved={this.handleRowMoved}
        />
      </Container>
    );
  }
}

const propTypes = {
  navigator: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.webRadio
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch)
});

WebRadio.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(WebRadio);
