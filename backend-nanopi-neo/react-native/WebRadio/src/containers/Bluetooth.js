import React, { PropTypes, PureComponent } from 'react';
import {
  Text
} from 'react-native';
import Container from '../components/Container';

class Bluetooth extends PureComponent {
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

const propTypes = {
  navigator: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

Bluetooth.propTypes = propTypes;
export default Bluetooth;
