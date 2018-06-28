import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Picker,
  Text,
} from 'react-native';
import i18n from 'i18next';
import {
  Dialog,
  DialogDefaultActions,
} from 'react-native-material-ui';
import uiTheme from '../../../MaterialUiTheme';

/* eslint-disable import/no-named-as-default-member */
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  errorLabel: {
    color: uiTheme.palette.accentColor,
    top: 10,
    padding: 8,
  },
});

const ErrorLabel = ({ title }) => (
  <Text
    style={styles.errorLabel}
  >
    {title}
  </Text>
);

ErrorLabel.propTypes = {
  title: PropTypes.string.isRequired,
};

class PickAudioPlaylistItemDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedPlaylist: {
        id: 0,
        title: '',
        folders: [],
      },
      selectedPlaylistPos: 0,
      pickError: null,
    };
  }

  handleActionPress = (action) => {
    this.setState({
      pickError: null,
    });
    const {
      folder,
      actions,
      onDismiss,
    } = this.props;
    if (action === 'Ok') {
      const {
        id,
        title,
        folders,
      } = this.state.selectedPlaylist;
      if (id === 0) {
        this.setState({
          pickError: i18n.t('pickAudioPlaylist.pickPlaylistError'),
        });
        return;
      }
      if (folders.includes(folder)) {
        this.setState({
          pickError: i18n.t('pickAudioPlaylist.alreadyExistError'),
        });
        return;
      }
      const newFolders = [
        ...folders,
        folder,
      ];
      actions.editItem({
        id,
        title,
        folders: newFolders,
      });
    }
    onDismiss();
  }

  handleChange = (selectedItem) => {
    if (selectedItem > 0) {
      this.setState({
        selectedPlaylist: this.props.items[selectedItem - 1],
        selectedPlaylistPos: selectedItem,
      });
      return;
    }
    this.setState({
      selectedPlaylist: {
        id: 0,
        title: '',
        folders: [],
      },
      selectedPlaylistPos: selectedItem,
    });
  }

  render() {
    const {
      items,
    } = this.props;
    const {
      selectedPlaylistPos,
      pickError,
    } = this.state;
    return (
      <View
        style={styles.container}
      >
        <View
          style={styles.subContainer}
        >
          <View>
            <Dialog>
              <Dialog.Title>
                {i18n.t('pickAudioPlaylist.pickPlaylist')}
              </Dialog.Title>
              <Dialog.Content>
                <Picker
                  mode="dropdown"
                  selectedValue={selectedPlaylistPos}
                  onValueChange={this.handleChange}
                >
                  <Picker.Item
                    key={0}
                    label={i18n.t('pickAudioPlaylist.choosePlaylist')}
                    value={0}
                  />
                  {items &&
                    items.map(item =>
                      (<Picker.Item
                        key={item.id}
                        label={item.title}
                        value={item.id}
                      />))
                  }
                </Picker>
                {pickError && <ErrorLabel title={pickError} />}
              </Dialog.Content>
              <Dialog.Actions>
                <DialogDefaultActions
                  actions={[i18n.t('editItem.close'), i18n.t('editItem.ok')]}
                  onActionPress={this.handleActionPress}
                />
              </Dialog.Actions>
            </Dialog>
          </View>
        </View>
      </View>
    );
  }
}

PickAudioPlaylistItemDialog.propTypes = {
  folder: PropTypes.string,
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

PickAudioPlaylistItemDialog.defaultProps = {
  folder: null,
};

export default PickAudioPlaylistItemDialog;
