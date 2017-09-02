import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ItemsList from '../../components/ItemsList';
import AudioTrackItem from './AudioTrackItem';
import * as itemsActions from '../../actions/AudioTrack';

const SCROLL_TO_SELECTION_DELAY = 3000;
const SCROLL_STEP = 61;

const scrollToSelection = (list, selectedId) => {
  const selectionOffset = (selectedId - 1) * SCROLL_STEP;
  const currentScrollTop = list.scrollProperties.offset;
  const currentScrollBottom = (list.scrollProperties.visibleLength
    + list.scrollProperties.offset) - SCROLL_STEP;
  if ((selectionOffset < currentScrollTop) || (selectionOffset > currentScrollBottom)) {
    const newOffset = selectionOffset - (list.scrollProperties.visibleLength / 2);
    list.scrollTo({ x: 0, y: newOffset, animated: true });
  }
};

class AudioTrack extends PureComponent {
  constructor(props) {
     super(props);
     this.state = {
       items: this.props.items,
       initialScrollCompleted: false,
     };
  }
  componentDidMount() {
    this.scrollTimer = setTimeout(() => {
      scrollToSelection(this.itemsList.refs.sortableList.refs.list,
        this.props.appState.selectedAudioTrackId);
        this.setState({
          initialScrollCompleted: true,
        });
      }, SCROLL_TO_SELECTION_DELAY);
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
    });
    if (this.state.initialScrollCompleted) {
      scrollToSelection(this.itemsList.refs.sortableList.refs.list,
        props.appState.selectedAudioTrackId);
    }
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
      <ItemsList
        ref={(ref) => { this.itemsList = ref; }}
        items={items}
        sort={false}
        renderRow={(item) => (
            <AudioTrackItem
              item={item}
              isSelected={(item.id === appState.selectedAudioTrackId)}
              onSelect={() => actions.playItem(item.id)}
            />
          )
        }
        onRowMoved={() => {}}
      />
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.audioTrack
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioTrack);
