import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const CenteredText = ({ text, fontSize }) => (
  <View style={styles.container}>
    <Text style={{ fontSize }}>
      {text}
    </Text>
  </View>
);

CenteredText.propTypes = {
  text: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
};

CenteredText.defaultProps = {
  fontSize: 20,
};

export default CenteredText;
