import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableHighlight } from 'react-native';
import {
  ListItem,
} from 'react-native-material-ui';
import i18n from 'i18next';

import PopupMenu from '../PopupMenu';

const handleRightIconPress = (eventName, index, onContextMenuPress) => {
  if (eventName !== 'itemSelected') return;
  onContextMenuPress(index);
};

const AudioFolderItem = ({ item, onContextMenuPress, onSelect }) => {
  return (
    <TouchableHighlight onPress={onSelect}>
      <View>
        <ListItem
          divider
          dense
          centerElement={{
            primaryText: item.title,
          }}
          rightElement={item.id === 0
            ? null
            : (
              <PopupMenu
                actions={
                [i18n.t('audioFolder.addToNewPlaylist'),
                  i18n.t('audioFolder.addToExistingPlaylist'),
                  i18n.t('audioFolder.rescanFolders')]
              }
                onPress={(eventName, index) => handleRightIconPress(eventName, index, onContextMenuPress)}
              />
            )}
        />
      </View>
    </TouchableHighlight>
  );
};

AudioFolderItem.propTypes = {
  item: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  onContextMenuPress: PropTypes.func.isRequired,
};

export default AudioFolderItem;
