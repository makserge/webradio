import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';

const TabBarIcon = ({ icon, tintColor }) => (
  <Icon
    name={icon}
    size={24}
    color={tintColor}
  />
);
TabBarIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  tintColor: PropTypes.string.isRequired,
};

export default TabBarIcon;
