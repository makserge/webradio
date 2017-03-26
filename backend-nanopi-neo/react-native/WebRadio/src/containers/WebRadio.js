import React, { PropTypes, Component } from 'react';
import {
  ActionButton
} from 'react-native-material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Container from '../components/Container';
import AppList from '../components/AppList';
import EditStreamDialog from '../components/EditStreamDialog';
import * as actions from '../actions/WebRadio';

class WebRadio extends Component {
  state = {
    openChangeItem: false,
    title: '',
    titleError: '',
    url: '',
    urlError: '',
    items: this.props.items,
    sortList: this.props.appState.sortWebradio,
    editId: 0
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
      sortList: props.appState.sortWebradio
    });
    if (props.appState.editWebRadio) {
      this.fillEditForm(props.appState.editWebRadioId);
      this.setState({
        openChangeItem: true,
      });
    }
  }

  fillEditForm(itemId) {
    for (const item of this.state.items) {
      if (item.id === itemId) {
        this.setState({
          editId: itemId,
          title: item.title,
          url: item.value,
        });
        return true;
      }
    }
  }

  checkDuplicateTitle(id, title) {
    const { items } = this.state;
    for (const item of items) {
      if (item.id !== id && item.title === title) {
        return true;
      }
    }
    return false;
  }

  checkDuplicateValue(id, value) {
    const { items } = this.state;
    for (const item of items) {
      if (item.id !== id && item.value === value) {
        return true;
      }
    }
    return false;
  }

  checkEmptyValue(value) {
    return value.trim() === '';
  }

  showEmptyValueError(key, value, error, message) {
    this.setState({
      [key]: value,
      [error]: this.checkEmptyValue(value) ? message : ''
    });
  }

  handleTitleChange = value => {
    this.setState({ title: value });
    this.showEmptyValueError('title', value, 'titleError', 'Item title can\'t be empty');
  }

  handleUrlChange = value => {
    this.setState({ url: value });
    this.showEmptyValueError('url', value, 'urlError', 'Item URL can\'t be empty');
  }

  handleEditTextBlur(key, value, error, message) {
    this.showEmptyValueError(key, value, error, message);
  }

  handleActionPress = (action) => {
    const {
      editId,
      title,
      url,
    } = this.state;
    if (action === 'Ok') {
      if (this.checkEmptyValue(title) || this.checkEmptyValue(url)) {
        this.showEmptyValueError('title', title, 'titleError', 'Item title can\'t be empty');
        this.showEmptyValueError('url', url, 'urlError', 'Item URL can\'t be empty');
        return;
      }
      if (this.checkDuplicateTitle(editId, title)) {
        this.setState({ titleError: 'Item with such title already exists' });
        return;
      }
      if (this.checkDuplicateValue(editId, url)) {
        this.setState({ urlError: 'Item with such URL already exists' });
        return;
      }
      if (editId === 0) {
        this.props.actions.addItem({
          title,
          value: url
        });
      } else {
        this.props.actions.editItem({
          id: editId,
          title,
          value: url
        });
      }
    }
    this.setState({
      editId: 0,
      title: '',
      titleError: '',
      url: '',
      urlError: '',
      openChangeItem: false,
    });
  }

  handleRowMoved = (oldIndex, newIndex) => {
    this.props.actions.sortItem({
      oldIndex,
      newIndex
    });
  }

  addItemDialog = (editId, title, titleError, url, urlError) => (
    <EditStreamDialog
      dialogTitle={editId === 0 ? 'Add stream' : 'Edit stream'}
      title={title}
      onChangeTitle={this.handleTitleChange}
      titleError={titleError}
      onBlurTitle={
        () => this.handleEditTextBlur('title', title, 'titleError',
        'Item title can\'t be empty')
      }
      url={url}
      onChangeUrl={this.handleUrlChange}
      urlError={urlError}
      onBlurUrl={
        () => this.handleEditTextBlur('url', url, 'urlError',
        'Item URL can\'t be empty')
      }
      onActionPress={this.handleActionPress}
    />);

  render() {
    const {
      navigator,
      route
    } = this.props;
    const {
      openChangeItem,
      editId,
      title,
      titleError,
      url,
      urlError,
      items,
      sortList
    } = this.state;

    return (
      <Container
        navigator={navigator}
        route={route}
        addItemDialog={openChangeItem ?
          this.addItemDialog(editId, title, titleError, url, urlError)
          :
          null
          }
        addItemButton={
          <ActionButton
            onPress={() => this.setState({ openChangeItem: true })}
          />
        }
      >
      <AppList
        items={items}
        sort={sortList}
        onRowMoved={this.handleRowMoved}
      />
      </Container>
    );
  }
}

const propTypes = {
  navigator: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  items: state.webRadio
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

WebRadio.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(WebRadio);
