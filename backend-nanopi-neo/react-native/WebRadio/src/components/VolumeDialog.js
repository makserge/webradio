import React, { PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Slider,
  Text
} from 'react-native';
import {
  COLOR,
  Dialog,
  DialogDefaultActions,
  IconToggle
} from 'react-native-material-ui';

const propTypes = {
    volume: PropTypes.number.isRequired,
    volumeMute: PropTypes.bool.isRequired,
    onVolumeChange: PropTypes.func.isRequired,
    onVolumeMutePress: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    innerContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    },
    muteContainer: {
      flex: 3
    },
    slider: {
      flex: 10
    },
    volume: {
      fontSize: 20,
      flex: 2,
      paddingLeft: 5
    }
});

const VolumeDialog = (props) => {
  const { container, innerContainer, muteContainer, slider, volume } = styles;

  return (
    <View style={container}>
      <Dialog>
        <Dialog.Content>
        <View style={innerContainer}>
          <View style={muteContainer}>
            <IconToggle
              key="mute"
              name={props.volumeMute ? 'volume-off' : 'volume-up'}
              color={COLOR.black}
              onPress={props.onVolumeMutePress}
            />
          </View>
          <Slider
            style={slider}
            value={props.volume}
            minimumValue={0}
            maximumValue={32}
            step={1}
            onValueChange={(value) => props.onVolumeChange(value)}
          />
          <Text
            style={volume}
          >
            {props.volume}
          </Text>
        </View>
        </Dialog.Content>
        <Dialog.Actions>
          <DialogDefaultActions
              actions={['Close']}
              onActionPress={props.onClose}
          />
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

VolumeDialog.propTypes = propTypes;
export default VolumeDialog;
