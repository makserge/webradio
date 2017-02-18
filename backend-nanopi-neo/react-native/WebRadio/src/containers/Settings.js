import React, { PropTypes, Component } from 'react';
import {
  Text
} from 'react-native';
import Container from '../components/Container';

const propTypes = {
  navigator: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

class Settings extends Component {
  render() {
    const { navigator, route } = this.props;

    return (
      <Container
        navigator={navigator}
        route={route}
      >
        <Text>
          Settings
        </Text>
      </Container>
    );
  }
}

Settings.propTypes = propTypes;
export default Settings;
