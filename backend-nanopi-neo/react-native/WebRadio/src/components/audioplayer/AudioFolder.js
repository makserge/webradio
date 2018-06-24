import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ItemsList from '../../components/ItemsList';
import AudioFolderItem from './AudioFolderItem';
import * as itemsActions from '../../actions/AudioFolder';

class AudioFolder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
    });
  }

  render() {
    const {
      actions,
    } = this.props;
    const {
      items,
    } = this.state;
    return (
      <ItemsList
        items={items}
        sort={false}
        renderRow={item => (
          <AudioFolderItem
            item={item}
            onSelect={() => actions.selectFolder(item.path)}
          />
          )
        }
        onRowMoved={() => {}}
      />
    );
  }
}

AudioFolder.propTypes = {
  items: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  items: state.audioFolder,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(itemsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioFolder);
