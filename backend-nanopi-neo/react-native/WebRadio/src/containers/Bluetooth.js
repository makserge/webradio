import React, { PropTypes, PureComponent } from 'react';
import {
  Text
} from 'react-native';
import Container from '../components/Container';

class Bluetooth extends PureComponent {
  render() {
    const { navigation } = this.props;

    return (
      <Container
        title="Bluetooth"
        navigation={navigation}
      >
        <Text>
          Bluetooth
        </Text>
      </Container>
    );
  }
}

const propTypes = {
  navigation: PropTypes.object.isRequired,
};

Bluetooth.propTypes = propTypes;
export default Bluetooth;
