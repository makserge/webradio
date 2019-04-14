import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FlatItemsList from '../FlatItemsList';
import AudioTrackItem from './AudioTrackItem';
import * as itemsActions from '../../actions/AudioTrack';

class AudioTrack extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
    });
  }

  componentWillUnmount() {
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
  }

  render() {
    const {
      actions,
      appState,
    } = this.props;
    const {
      items,
    } = this.state;
    return (
      <FlatItemsList
        items={items}
        selectedItem={appState.selectedAudioTrackId}
        renderRow={item => (
          <AudioTrackItem
            item={item}
            isSelected={(item.id === appState.selectedAudioTrackId)}
            onSelect={() => actions.playItem(item.id)}
          />
        )}
      />
    );
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
