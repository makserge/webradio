import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import i18n from 'i18next';

import FlatItemsList from '../FlatItemsList';
import AudioTrackItem from './AudioTrackItem';
import * as itemsActions from '../../actions/AudioTrack';
import CenteredText from '../CenteredText';

class AudioTrack extends PureComponent {
  render() {
    const {
      items,
      appState,
      actions,
    } = this.props;
    return (items.length > 0) ? (
      <FlatItemsList
        items={items}
        selectedItem={appState.selectedAudioTrackId}
        renderItem={({ item }) => (
          <AudioTrackItem
            item={item}
            isSelected={(item.id === appState.selectedAudioTrackId)}
            onSelect={() => actions.playItem(item.id)}
          />
        )}
      />
    )
      : <CenteredText text={i18n.t('audioTrack.noTracks')} />;
  }
}

AudioTrack.propTypes = {
  items: PropTypes.array.isRequired,
  appState: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.audioTrack,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioTrack);
