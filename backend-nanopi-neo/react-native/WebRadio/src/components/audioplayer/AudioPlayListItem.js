import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, View } from 'react-native';
import {
  COLOR,
  ListItem,
  Icon,
} from 'react-native-material-ui';
import { CircleSnail } from 'react-native-progress';
import i18n from 'i18next';

import PopupMenu from './../PopupMenu';

const handleRightIconPress = (eventName, index, onContextMenuPress) => {
  if (eventName !== 'itemSelected') return;
  onContextMenuPress(index);
};

/* eslint-disable import/no-named-as-default-member */
const renderRightElement = (isUpdating, ieEditMode, isSortMode, onPress) => {
  if (isUpdating) {
    return (
      <CircleSnail
        indeterminate
        size={30}
        color={COLOR.black}
        direction="clockwise"
      />
    );
  } else if (isSortMode) {
    return (
      <Icon
        name="reorder"
      />
    );
  } else if (ieEditMode) {
    return (
      <PopupMenu
        actions={[i18n.t('audioPlaylist.edit'), i18n.t('audioPlaylist.reorder'),
          i18n.t('audioPlaylist.delete')]}
        onPress={(eventName, index) => handleRightIconPress(eventName, index, onPress)}
      />
    );
  }
  return null;
};

const renderRoot = (item, isUpdating, isSortMode, isEditMode, onContextMenuPress, isSelected) => (
  <View>
    <ListItem
      divider
      dense
      leftElement={
        isSelected ?
        'play-arrow'
         :
        <Icon name="play-arrow" color={COLOR.transparent} />
      }
      centerElement={{
        primaryText: item.title,
        secondaryText: i18n.t('audioPlaylist.subTitle', { tracks: item.tracksCount, folders: item.folders.length > 0 ? item.folders.join(', ') : i18n.t('audioPlaylist.noFolders'), interpolation: { escapeValue: false } }),
      }}
      rightElement={renderRightElement(isUpdating, isEditMode, isSortMode, onContextMenuPress)}
    />
  </View>);

const AudioPlayListItem = (props) => {
  const {
    item,
    isUpdating,
    isSortMode,
    isEditMode,
    sortHandlers,
    onSelect,
    onItemLongPress,
    onContextMenuPress,
    isSelected,
  } = props;
  return (
    (isSortMode ?
      <TouchableHighlight {...sortHandlers}>
        {renderRoot(item, isUpdating, isSortMode, isEditMode, onContextMenuPress, isSelected)}
      </TouchableHighlight>
      :
      <TouchableHighlight
        onPress={() => onSelect(item.id)}
        onLongPress={onItemLongPress}
      >
        {renderRoot(item, isUpdating, isSortMode, isEditMode, onContextMenuPress, isSelected)}
      </TouchableHighlight>
    ));
};

AudioPlayListItem.propTypes = {
  item: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isSortMode: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  onItemLongPress: PropTypes.func.isRequired,
  sortHandlers: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  onContextMenuPress: PropTypes.func.isRequired,
};

AudioPlayListItem.defaultProps = {
  sortHandlers: null,
};

export default AudioPlayListItem;
