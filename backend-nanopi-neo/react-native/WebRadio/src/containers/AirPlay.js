import React, { PropTypes, PureComponent } from 'react';
import {
  Text
} from 'react-native';
import Container from '../components/Container';

class AirPlay extends PureComponent {
  render() {
    const { navigator, route } = this.props;

    return (
      <Container
        navigator={navigator}
        route={route}
      >
        <Text>
          AirPlay
        </Text>
      </Container>
    );
  }
}

const propTypes = {
  navigator: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

AirPlay.propTypes = propTypes;
export default AirPlay;
