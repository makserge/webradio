import React, { PropTypes, PureComponent } from 'react';
import {
  Text
} from 'react-native';
import Container from '../components/Container';

class LineIn extends PureComponent {
  render() {
    const { navigation } = this.props;

    return (
      <Container
        title="Line In"
        navigation={navigation}
      >
        <Text>
          LineIn
        </Text>
      </Container>
    );
  }
}

const propTypes = {
  navigation: PropTypes.object.isRequired,
};

LineIn.propTypes = propTypes;
export default LineIn;
