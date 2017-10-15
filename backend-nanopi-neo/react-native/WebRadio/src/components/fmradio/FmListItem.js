import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, View } from 'react-native';
import {
  COLOR,
  ListItem,
  Icon
} from 'react-native-material-ui';
import i18n from 'i18next';

import PopupMenuAndroid from './../PopupMenuAndroid';

/* eslint-disable import/no-named-as-default-member */
const renderRightElement = (isSortMode, onPress) =>
  (isSortMode ?
    <Icon
      name='reorder'
    />
    :
    <PopupMenuAndroid
      actions={[i18n.t('fmRadio.edit'), i18n.t('fmRadio.reorder'),
        i18n.t('fmRadio.delete')]}
      onPress={(eventName, index) => handleRightIconPress(eventName, index, onPress)}
    />);

const renderRoot = (item, sortList, onContextMenuPress, isSelected) =>
  <View>
    <ListItem
      divider
      dense
      leftElement={
        isSelected ?
        'play-arrow'
         :
         <Icon name='play-arrow' color={COLOR.transparent} />
      }
      centerElement={{
        primaryText: item.title,
        secondaryText: item.value,
      }}
      rightElement={renderRightElement(sortList, onContextMenuPress)}
    />
  </View>;

const handleRightIconPress = (eventName, index, onContextMenuPress) => {
  if (eventName !== 'itemSelected') return;
  onContextMenuPress(index);
};

const FmListItem = (props) => {
  const {
    item,
    isSortMode,
    sortHandlers,
    onSelect,
    onContextMenuPress,
    isSelected,
  } = props;
  return (
    (isSortMode ?
      <TouchableHighlight {...sortHandlers}>
        {renderRoot(item, isSortMode, onContextMenuPress, isSelected)}
      </TouchableHighlight>
      :
      <TouchableHighlight onPress={() => onSelect(item.id)}>
        {renderRoot(item, isSortMode, onContextMenuPress, isSelected)}
      </TouchableHighlight>
    ));
};

const propTypes = {
  item: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isSortMode: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onContextMenuPress: PropTypes.func.isRequired,
};

FmListItem.propTypes = propTypes;
export default FmListItem;
