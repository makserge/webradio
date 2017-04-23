import React, { PureComponent, PropTypes } from 'react';
import {
  View,
  UIManager,
  findNodeHandle,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ICON_SIZE = 24;

class PopupMenuAndroid extends PureComponent {
  constructor(props) {
     super(props);
     this.state = {
       icon: null
     };
  }

  onError() {
    console.log('Popup Error');
  }

  onPress = () => {
    if (this.state.icon) {
      UIManager.showPopupMenu(
        findNodeHandle(this.state.icon),
        this.props.actions,
        this.onError,
        this.props.onPress
      );
    }
  }

  onRef = icon => {
    if (!this.state.icon) {
      this.setState({ icon });
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={this.onPress}
        >
          <Icon
            name='more-vert'
            size={ICON_SIZE}
            color={'grey'}
            ref={this.onRef}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onPress: PropTypes.func.isRequired
};

PopupMenuAndroid.propTypes = propTypes;
export default PopupMenuAndroid;
