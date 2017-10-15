
import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableHighlight,
  Text,
  View
} from 'react-native';

const ServerHost = (props) =>
  <View>
    <TouchableHighlight
      underlayColor='#dddddd'
      onPress={props.onPress}
    >
      <Text>
        {props.value}
      </Text>
    </TouchableHighlight>
  </View>;

const propTypes = {
  value: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

ServerHost.propTypes = propTypes;
export default ServerHost;
