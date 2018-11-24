import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  UIManager,
  findNodeHandle,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ICON_SIZE = 24;

class PopupMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      icon: null,
    };
  }

  onError = () => { }

  onPress = () => {
    const { icon } = this.state;
    const { actions, onPress } = this.props;
    if (icon) {
      UIManager.showPopupMenu(
        findNodeHandle(icon),
        actions,
        this.onError,
        onPress,
      );
    }
  }

  onRef = (newIcon) => {
    const { icon } = this.state;
    if (!icon) {
      this.setState({ icon: newIcon });
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={this.onPress}
        >
          <Icon
            name="more-vert"
            size={ICON_SIZE}
            color="grey"
            ref={this.onRef}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

PopupMenu.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default PopupMenu;
