import React, { PropTypes, PureComponent } from 'react';
import {
  ActionButton
} from 'react-native-material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Container from '../components/Container';
import ItemsList from '../components/ItemsList';
import WebListItem from '../components/webradio/WebListItem';
import EditWebItemDialog from '../components/webradio/EditWebItemDialog';
import * as itemsActions from '../actions/WebRadio';

class WebRadio extends PureComponent {
  constructor(props) {
     super(props);
     this.state = {
       openChangeItem: false,
       items: this.props.items,
       sortList: this.props.appState.sortWebRadio,
       editId: 0
     };
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
      sortList: props.appState.sortWebRadio
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
          <EditWebItemDialog
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
          renderRow={(item) => (
              <WebListItem
                item={item}
                actions={actions}
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
