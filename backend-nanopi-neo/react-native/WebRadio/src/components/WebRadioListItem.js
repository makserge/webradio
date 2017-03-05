import React, { PropTypes } from 'react';
import {
  COLOR,
  ListItem,
  Icon
} from 'react-native-material-ui';
import { connect } from 'react-redux';
import PopupMenuAndroid from './PopupMenuAndroid';
import * as actions from '../actions/WebRadio';

const WebRadioListItem = (props) => {
  const {
    item,
    onRightElementPress,
    selectItem,
    appState
  } = props;
  return (
    <ListItem
      divider
      dense
      leftElement={appState.selectedWebradioId === item.id ?
        'play-arrow' : <Icon name="play-arrow" color={COLOR.transparent} />}
      centerElement={{
        primaryText: item.title,
        secondaryText: item.value,
      }}
      rightElement={
        <PopupMenuAndroid
          actions={['Edit', 'Reorder', 'Delete']}
          onPress={(eventName, index) => {
            if (eventName !== 'itemSelected') return;
              console.log(index);
            }
          }
        />
      }
      onPress={() => selectItem(item.id)}
      onRightElementPress={onRightElementPress}
    />
  );
};

const mapStateToProps = state => {
  return {
    appState: state.appState
   };
};

const propTypes = {
  item: PropTypes.object.isRequired,
  onRightElementPress: PropTypes.func.isRequired
};

WebRadioListItem.propTypes = propTypes;
export default connect(mapStateToProps, actions)(WebRadioListItem);
