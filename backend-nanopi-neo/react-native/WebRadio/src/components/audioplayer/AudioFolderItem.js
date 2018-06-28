import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight } from 'react-native';
import {
  ListItem,
} from 'react-native-material-ui';
import i18n from 'i18next';

import PopupMenu from './../PopupMenu';

const handleRightIconPress = (eventName, index, onContextMenuPress) => {
  if (eventName !== 'itemSelected') return;
  onContextMenuPress(index);
};

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

const renderRoot = (item, onPress) => {
  return (
    <ListItem
      divider
      dense
      centerElement={{
        primaryText: item.title,
      }}
      rightElement={
        <PopupMenu
          actions={
            [i18n.t('audioFolder.addToNewPlaylist'),
            i18n.t('audioFolder.addToExistingPlaylist'),
            i18n.t('audioFolder.rescanFolders')]
          }
          onPress={(eventName, index) => handleRightIconPress(eventName, index, onPress)}
        />
      }
    />
  );
};

const AudioFolderItem = (props) => {
  const {
    item,
    onSelect,
    onContextMenuPress,
  } = props;
  return (
    <TouchableHighlight
      onPress={onSelect}
    >
      {item.id === 0 ? renderTop(item) : renderRoot(item, onContextMenuPress)}
    </TouchableHighlight>
  );
};

AudioFolderItem.propTypes = {
  item: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  onContextMenuPress: PropTypes.func.isRequired,
};

export default AudioFolderItem;
