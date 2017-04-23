import React, { PropTypes, PureComponent } from 'react';
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

class FmRadio extends PureComponent {
  constructor(props) {
     super(props);
     this.state = {
       openChangeItem: false,
       items: this.props.items,
       sortList: this.props.appState.sortFmRadio,
       editId: 0
     };
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
      sortList: props.appState.sortFmRadio
    });
    if (props.appState.editFmRadio) {
      this.setState({
        editId: props.appState.editFmRadioId,
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
          sort={sortList}
          renderRow={(item) => (
              <FmListItem
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
  items: state.fmRadio
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch)
});

FmRadio.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(FmRadio);
