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
        secondaryText: item.path === '' ? i18n.t('audioFolder.returnToRoot') : i18n.t('audioFolder.returnToFolder', { folder: item.path, interpolation: { escapeValue: false } }),
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
        secondaryText: i18n.t('audioFolder.itemDetials', { folders: item.folders, files: item.files }),
      }}
    />
  );
};

const AudioFolderItem = (props) => {
  const {
    item,
    onSelect,
  } = props;
  return (item.id === 0 || item.folders > 0) ?
    (
      <TouchableHighlight
        onPress={onSelect}
      >
        {item.id === 0 ? renderTop(item) : renderRoot(item)}
      </TouchableHighlight>
    )
    :
    renderRoot(item);
};

AudioFolderItem.propTypes = {
  item: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default AudioFolderItem;
