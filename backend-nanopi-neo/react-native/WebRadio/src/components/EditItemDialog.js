import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import {
  Dialog,
  DialogDefaultActions,
} from 'react-native-material-ui';
import { TextField } from 'react-native-material-textfield';
import i18n from 'i18next';

import uiTheme from '../../MaterialUiTheme';

const EditItemDialog = (props) => {
  const {
    dialogTitle,
    titleLabel,
    title,
    titleError,
    onTitleChange,
    onBlurTitle,
    valueElement,
    onActionPress,
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
        alignItems: 'center',
      }}
    >
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}
      >
        <View>
          <Dialog>
            <Dialog.Title>
              {dialogTitle}
            </Dialog.Title>
            <Dialog.Content>
              <TextField
                label={titleLabel}
                tintColor={uiTheme.palette.primaryColor}
                errorColor={uiTheme.palette.accentColor}
                value={title}
                onChangeText={onTitleChange}
                onBlur={onBlurTitle}
                error={titleError}
              />
              {valueElement}
            </Dialog.Content>
            <Dialog.Actions>
              <DialogDefaultActions
                actions={[i18n.t('editItem.close'), i18n.t('editItem.ok')]}
                onActionPress={onActionPress}
              />
            </Dialog.Actions>
          </Dialog>
        </View>
      </View>
    </View>);
};

EditItemDialog.propTypes = {
  dialogTitle: PropTypes.string.isRequired,
  titleLabel: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  titleError: PropTypes.string.isRequired,
  onBlurTitle: PropTypes.func.isRequired,
  valueElement: PropTypes.object.isRequired,
  onActionPress: PropTypes.func.isRequired,
};

export default EditItemDialog;
