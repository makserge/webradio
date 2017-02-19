import React, { PropTypes, Component } from 'react';
import Container from '../components/Container';
import AppList from '../components/AppList';

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
      <AppList />
      </Container>
    );
  }
}

WebRadio.propTypes = propTypes;
export default WebRadio;
