import React, { PropTypes, Component } from 'react';
import {
  ActionButton
} from 'react-native-material-ui';
import Container from '../components/Container';
import AppList from '../components/AppList';
import EditStreamDialog from '../components/EditStreamDialog';

const propTypes = {
  navigator: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

class WebRadio extends Component {
  state = {
    openAddItem: false
  }

  handleActionPress(action) {
    if (action === 'Ok') {
      console.log('Ok');
    }
    this.setState({ openAddItem: false });
  }

  render() {
    const { navigator, route } = this.props;

    let addItemDialog;
    if (this.state.openAddItem) {
      addItemDialog = (
        <EditStreamDialog
          title='Add stream'
          onActionPress={(action) => this.handleActionPress(action)}
        />);
    }

    return (
      <Container
        navigator={navigator}
        route={route}
        addItemDialog={addItemDialog}
        addItemButton={
          <ActionButton
            onPress={() => this.setState({ openAddItem: true })}
          />
        }
      >
      <AppList />
      </Container>
    );
  }
}

WebRadio.propTypes = propTypes;
export default WebRadio;
