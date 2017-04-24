import React, { PropTypes } from 'react';
import { TouchableHighlight, View } from 'react-native';
import {
  COLOR,
  ListItem,
  Icon
} from 'react-native-material-ui';
import { connect } from 'react-redux';

const renderLeftElement = (id, appState) =>
    ((id === appState.selectedAudioTrackId) ?
    'play-arrow'
     :
     <Icon name='play-arrow' color={COLOR.transparent} />);

const renderRoot = (item, appState) =>
  <View>
    <ListItem
      divider
      dense
      leftElement={
        renderLeftElement(item.id, appState)
      }
      centerElement={{
        primaryText: item.title,
        secondaryText: item.value,
      }}
    />
  </View>;

const AudioTrackItem = (props) => {
  const {
    item,
    appState,
    actions,
  } = props;
  console.log(item);
  return (
    <TouchableHighlight onPress={() => actions.playItem(item.id)}>
      {renderRoot(item, appState, actions)}
    </TouchableHighlight>
  );
};

const mapStateToProps = state => ({
    appState: state.appState
});

const propTypes = {
  item: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

AudioTrackItem.propTypes = propTypes;
export default connect(mapStateToProps, null)(AudioTrackItem);
