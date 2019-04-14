import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

const CenteredText = ({ text }) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={{ fontSize: 20 }}>
      {text}
    </Text>
  </View>
);

CenteredText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CenteredText;
