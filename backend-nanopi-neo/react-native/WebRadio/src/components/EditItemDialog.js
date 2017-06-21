import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text
} from 'react-native';
import {
  Dialog,
  DialogDefaultActions
} from 'react-native-material-ui';
import TextField from 'react-native-md-textinput';
import uiTheme from '../../MaterialUiTheme';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorText: {
      color: uiTheme.palette.accentColor,
      fontSize: 12
    }
});

const EditItemDialog = (props) => {
  const {
    errorText
  } = styles;
  const {
    dialogTitle,
    titleLabel,
    title,
    titleError,
    onTitleChange,
    onBlurTitle,
    valueElement,
    valueError,
    onActionPress
  } = props;

  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'flex-start'
        }}
      >
        <View>
          <Dialog>
            <Dialog.Title>
              {dialogTitle}
            </Dialog.Title>
            <Dialog.Content>
              <TextField
              dense
              label={titleLabel}
              highlightColor={uiTheme.palette.primaryColor}
              borderColor={
                titleError ? uiTheme.palette.accentColor
                : uiTheme.palette.defaultTextInputBorderColor
              }
              value={title}
              onChangeText={onTitleChange}
              onBlur={onBlurTitle}
              />
              <Text style={errorText}>
              {titleError}
              </Text>
              {valueElement}
              <Text style={styles.errorText}>
              {valueError}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
            <DialogDefaultActions
              actions={['Close', 'Ok']}
              onActionPress={onActionPress}
            />
            </Dialog.Actions>
          </Dialog>
        </View>
      </View>
    </View>);
};

const propTypes = {
    dialogTitle: PropTypes.string.isRequired,
    titleLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onTitleChange: PropTypes.func.isRequired,
    titleError: PropTypes.string.isRequired,
    onBlurTitle: PropTypes.func.isRequired,
    valueElement: PropTypes.object.isRequired,
    valueError: PropTypes.string.isRequired,
    onActionPress: PropTypes.func.isRequired
};

EditItemDialog.propTypes = propTypes;
export default EditItemDialog;
