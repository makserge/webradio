import React, { PropTypes } from 'react';
import { TouchableHighlight, View } from 'react-native';
import {
  COLOR,
  ListItem,
  Icon
} from 'react-native-material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PopupMenuAndroid from './PopupMenuAndroid';
import * as actions from '../actions/WebRadio';

const SORT_MODE = 1;

const renderLeftElement = (id, appState) =>
    ((id === appState.selectedWebradioId && !appState.sortWebradio) ?
    'play-arrow'
     :
     <Icon name='play-arrow' color={COLOR.transparent} />);

const renderRightElement = (appState, setSortMode) =>
  (appState.sortWebradio ?
    <Icon
      name='reorder'
    />
    :
    <PopupMenuAndroid
      actions={['Edit', 'Reorder', 'Delete']}
      onPress={
        (eventName, index) => handleRightIconPress(eventName, index, setSortMode)
      }
    />);

const renderRoot = (item, appState, setSortMode) =>
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
      rightElement={renderRightElement(appState, setSortMode)}
    />
  </View>;

const handleRightIconPress = (eventName, index, setSortMode) => {
  if (eventName !== 'itemSelected') return;
  //  console.log(index);
    switch (index) {
      case SORT_MODE:
        setSortMode();
        break;
      default:
  }
};

const WebRadioListItem = (props) => {
  const {
    item,
    appState,
    sortHandlers,
  } = props;
  return (
    (appState.sortWebradio ?
      <TouchableHighlight {...sortHandlers}>
        {renderRoot(item, appState, props.actions.setSortMode)}
      </TouchableHighlight>
      :
      <TouchableHighlight onPress={() => props.actions.selectItem(item.id)}>
        {renderRoot(item, appState, props.actions.setSortMode)}
      </TouchableHighlight>
    ));
};

const mapStateToProps = state => ({
    appState: state.appState
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

const propTypes = {
  item: PropTypes.object.isRequired
};

WebRadioListItem.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(WebRadioListItem);
