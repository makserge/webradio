import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, View } from 'react-native';
import {
  COLOR,
  ListItem,
  Icon,
} from 'react-native-material-ui';

const renderRoot = (item, isSelected) => (
  <View
    key={item.id}
  >
    <ListItem
      divider
      dense
      leftElement={
        isSelected
          ? 'play-arrow'
          : <Icon name="play-arrow" color={COLOR.transparent} />
      }
      centerElement={{
        primaryText: item.artist,
        secondaryText: item.title,
      }}
    />
  </View>
);

const AudioTrackItem = (props) => {
  const {
    item,
    onSelect,
    isSelected,
  } = props;
  return (
    <TouchableHighlight onPress={() => onSelect(item.id)}>
      {renderRoot(item, isSelected)}
    </TouchableHighlight>
  );
};

AudioTrackItem.propTypes = {
  item: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default AudioTrackItem;
