import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Slider,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  COLOR,
  IconToggle,
  Card,
} from 'react-native-material-ui';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    margin: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  slider: {
    width: 200,
  },
  volumeStyle: {
    marginLeft: 10,
    fontSize: 18,
    width: 25,
  },
});

const VolumePopover = (props) => {
  const {
    container,
    innerContainer,
    slider,
    volumeStyle,
  } = styles;
  const {
    onClose,
    volumeMute,
    onVolumeMutePress,
    volume,
    onVolumeChange,
  } = props;
  return (
    <TouchableWithoutFeedback
      onPress={onClose}
    >
      <View
        style={container}
      >
        <Card
          onPress={event => event.preventDefault()}
        >
          <View
            style={innerContainer}
          >
            <IconToggle
              key="mute"
              name={volumeMute ? 'volume-off' : 'volume-up'}
              color={COLOR.black}
              onPress={onVolumeMutePress}
            />
            <Slider
              style={slider}
              value={volume}
              minimumValue={0}
              maximumValue={32}
              step={1}
              onValueChange={value => onVolumeChange(value)}
            />
            <Text
              style={volumeStyle}
            >
              {volume}
            </Text>
          </View>
        </Card>
      </View>
    </TouchableWithoutFeedback>
  );
};

VolumePopover.propTypes = {
  volume: PropTypes.number.isRequired,
  volumeMute: PropTypes.bool.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
  onVolumeMutePress: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VolumePopover;
