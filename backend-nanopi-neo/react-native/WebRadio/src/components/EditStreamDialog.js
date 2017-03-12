import React, { PropTypes } from 'react';
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

const EditStreamDialog = (props) => {
  const {
    errorText
  } = styles;
  const {
    dialogTitle,
    title,
    titleError,
    onChangeTitle,
    onBlurTitle,
    url,
    urlError,
    onChangeUrl,
    onBlurUrl,
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
    padding: 24,
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
                  label="Title"
                  highlightColor={uiTheme.palette.primaryColor}
                  borderColor={
                    titleError ? uiTheme.palette.accentColor
                    : uiTheme.palette.defaultTextInputBorderColor
                  }
                  value={title}
                  onChangeText={onChangeTitle}
                  onBlur={onBlurTitle}
                />
                <Text style={errorText}>
                  {titleError}
                </Text>
                <TextField
                  dense
                  label="URL"
                  highlightColor={uiTheme.palette.primaryColor}
                  borderColor={
                    urlError ? uiTheme.palette.accentColor
                    : uiTheme.palette.defaultTextInputBorderColor
                  }
                  value={url}
                  onChangeText={onChangeUrl}
                  onBlur={onBlurUrl}
                />
                <Text style={styles.errorText}>
                  {urlError}
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
    </View>
  );
};

const propTypes = {
    dialogTitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    titleError: PropTypes.string.isRequired,
    onBlurTitle: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    urlError: PropTypes.string.isRequired,
    onBlurUrl: PropTypes.func.isRequired,
    onActionPress: PropTypes.func.isRequired
};

EditStreamDialog.propTypes = propTypes;
export default EditStreamDialog;
