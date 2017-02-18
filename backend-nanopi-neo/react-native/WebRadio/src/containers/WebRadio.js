import React, { PropTypes, Component } from 'react';
import {
  Text
} from 'react-native';
import Container from '../components/Container';

const propTypes = {
  navigator: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

class WebRadio extends Component {
  render() {
    const { navigator, route } = this.props;

    return (
      <Container
        navigator={navigator}
        route={route}
      >
        <Text>
          WebRadio
        </Text>
      </Container>
    );
  }
}

WebRadio.propTypes = propTypes;
export default WebRadio;
