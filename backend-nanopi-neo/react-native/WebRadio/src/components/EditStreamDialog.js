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
    <View style={styles.container}>
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
                <Text style={styles.errorText}>
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
