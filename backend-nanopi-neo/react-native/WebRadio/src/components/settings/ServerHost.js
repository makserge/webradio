import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableHighlight,
  Text,
  View,
} from 'react-native';

const ServerHost = ({ onPress, value }) => (
  <View>
    <TouchableHighlight
      underlayColor="#dddddd"
      onPress={onPress}
    >
      <Text>
        {value}
      </Text>
    </TouchableHighlight>
  </View>
);

ServerHost.propTypes = {
  value: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default ServerHost;
