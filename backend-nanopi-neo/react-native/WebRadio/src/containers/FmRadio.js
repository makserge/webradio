import React, { PropTypes, Component } from 'react';
import {
  Text
} from 'react-native';
import Container from '../components/Container';

const propTypes = {
  navigator: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

class FmRadio extends Component {
  render() {
    const { navigator, route } = this.props;

    return (
      <Container
        navigator={navigator}
        route={route}
      >
        <Text>
          FmRadio
        </Text>
      </Container>
    );
  }
}

FmRadio.propTypes = propTypes;
export default FmRadio;
