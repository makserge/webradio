import React, { PropTypes, Component } from 'react';
import {
  Text
} from 'react-native';
import Container from '../components/Container';

const propTypes = {
  navigator: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

class Bluetooth extends Component {
  render() {
    const { navigator, route } = this.props;

    return (
      <Container
        navigator={navigator}
        route={route}
      >
        <Text>
          Bluetooth
        </Text>
      </Container>
    );
  }
}

Bluetooth.propTypes = propTypes;
export default Bluetooth;
