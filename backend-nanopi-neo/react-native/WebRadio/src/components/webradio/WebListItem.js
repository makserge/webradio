import React, { PropTypes } from 'react';
import { TouchableHighlight, View } from 'react-native';
import {
  COLOR,
  ListItem,
  Icon
} from 'react-native-material-ui';
import { connect } from 'react-redux';
import PopupMenuAndroid from './../PopupMenuAndroid';

const EDIT_MODE = 0;
const SORT_MODE = 1;
const DELETE_MODE = 2;

const renderLeftElement = (id, appState) =>
    ((id === appState.selectedWebRadioId && !appState.sortWebRadio) ?
    'play-arrow'
     :
     <Icon name='play-arrow' color={COLOR.transparent} />);

const renderRightElement = (item, appState, actions) =>
  (appState.sortWebRadio ?
    <Icon
      name='reorder'
    />
    :
    <PopupMenuAndroid
      actions={['Edit', 'Reorder', 'Delete']}
      onPress={
        (eventName, index) =>
          handleRightIconPress(eventName, index, item, actions)
      }
    />);

const renderRoot = (item, appState, actions) =>
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
      rightElement={renderRightElement(item, appState, actions)}
    />
  </View>;

const handleRightIconPress = (eventName, index, item, actions) => {
  if (eventName !== 'itemSelected') return;
    switch (index) {
      case EDIT_MODE:
        actions.editItemMode(item.id);
        break;
      case SORT_MODE:
        actions.sortItemMode();
        break;
      case DELETE_MODE:
        actions.deleteItem(item.id);
        break;
      default:
  }
};

const WebListItem = (props) => {
  const {
    item,
    appState,
    sortHandlers,
    actions,
  } = props;
  return (
    (appState.sortWebRadio ?
      <TouchableHighlight {...sortHandlers}>
        {renderRoot(item, appState, actions)}
      </TouchableHighlight>
      :
      <TouchableHighlight onPress={() => actions.selectItem(item.id)}>
        {renderRoot(item, appState, actions)}
      </TouchableHighlight>
    ));
};

const mapStateToProps = state => ({
    appState: state.appState
});

const propTypes = {
  item: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

WebListItem.propTypes = propTypes;
export default connect(mapStateToProps, null)(WebListItem);
