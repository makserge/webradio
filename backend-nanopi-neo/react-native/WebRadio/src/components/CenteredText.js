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
  label: {
    fontSize: 20,
  },
});

const CenteredText = ({ text }) => (
  <View style={styles.container}>
    <Text style={styles.label}>
      {text}
    </Text>
  </View>
);

CenteredText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CenteredText;
