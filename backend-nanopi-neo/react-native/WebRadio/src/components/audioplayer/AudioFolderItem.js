import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight } from 'react-native';
import {
  ListItem,
} from 'react-native-material-ui';
import i18n from 'i18next';

const renderTop = (item) => {
  return (
    <ListItem
      divider
      dense
      centerElement={{
        primaryText: item.title,
      }}
    />
  );
};

const renderRoot = (item) => {
  return (
    <ListItem
      divider
      dense
      centerElement={{
        primaryText: item.title,
      }}
    />
  );
};

const AudioFolderItem = (props) => {
  const {
    item,
    onSelect,
  } = props;
  return (
    <TouchableHighlight
      onPress={onSelect}
    >
      {item.id === 0 ? renderTop(item) : renderRoot(item)}
    </TouchableHighlight>
  );
};

AudioFolderItem.propTypes = {
  item: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default AudioFolderItem;
