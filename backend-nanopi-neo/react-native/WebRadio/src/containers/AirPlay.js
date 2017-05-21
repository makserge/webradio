import React, { PropTypes, PureComponent } from 'react';
import {
  Text
} from 'react-native';
import Container from '../components/Container';

class AirPlay extends PureComponent {
  render() {
    const { navigation } = this.props;

    return (
      <Container
        title="AirPlay"
        navigation={navigation}
      >
        <Text>
          AirPlay
        </Text>
      </Container>
    );
  }
}

const propTypes = {
  navigation: PropTypes.object.isRequired,
};

AirPlay.propTypes = propTypes;
export default AirPlay;
