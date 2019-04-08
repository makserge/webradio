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

const EditValueDialog = (props) => {
  const {
    dialogTitle,
    label,
    value,
    error,
    onChange,
    onBlur,
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
                label={label}
                tintColor={uiTheme.palette.primaryColor}
                errorColor={uiTheme.palette.accentColor}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <DialogDefaultActions
                actions={[i18n.t('editValue.close'), i18n.t('editValue.ok')]}
                onActionPress={onActionPress}
              />
            </Dialog.Actions>
          </Dialog>
        </View>
      </View>
    </View>
  );
};

EditValueDialog.propTypes = {
  dialogTitle: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onActionPress: PropTypes.func.isRequired,
};

export default EditValueDialog;
