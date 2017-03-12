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

const addItemDialog = (title, titleError, url, urlError,
  handleEditTextBlur, handleTitleChange, handleUrlChange, handleActionPress) => (
  <EditStreamDialog
    dialogTitle='Add stream'
    title={title}
    onChangeTitle={handleTitleChange}
    titleError={titleError}
    onBlurTitle={
      () => handleEditTextBlur('title', title, 'titleError',
      'Item title can\'t be empty')
    }
    url={url}
    onChangeUrl={handleUrlChange}
    urlError={urlError}
    onBlurUrl={
      () => handleEditTextBlur('url', url, 'urlError',
      'Item URL can\'t be empty')
    }
    onActionPress={handleActionPress}
  />);

class WebRadio extends Component {
  state = {
    openAddItem: false,
    title: '',
    titleError: '',
    url: '',
    urlError: '',
    items: this.props.items,
    sortList: this.props.appState.sortWebradio
  }

  componentWillReceiveProps(props) {
    this.setState({
      items: props.items,
      sortList: props.appState.sortWebradio
    });
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
      title,
      url,
    } = this.state;
    if (action === 'Ok') {
      if (this.checkEmptyValue(title) || this.checkEmptyValue(url)) {
        this.showEmptyValueError('title', title, 'titleError', 'Item title can\'t be empty');
        this.showEmptyValueError('url', url, 'urlError', 'Item URL can\'t be empty');
        return;
      }
      if (this.checkDuplicateTitle(0, title)) {
        this.setState({ titleError: 'Item with such title already exists' });
        return;
      }
      if (this.checkDuplicateValue(0, url)) {
        this.setState({ urlError: 'Item with such URL already exists' });
        return;
      }
      this.props.actions.addItem({
        title,
        value: url
      });
    }
    this.setState({
      title: '',
      titleError: '',
      url: '',
      urlError: '',
      openAddItem: false,
    });
  }

  handleRowMoved = (oldIndex, newIndex) => {
    this.props.actions.reorderItem({
      oldIndex,
      newIndex
    });
  }

  render() {
    const {
      navigator,
      route
    } = this.props;
    const {
      openAddItem,
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
        addItemDialog={openAddItem ?
          addItemDialog(title, titleError, url, urlError,
            this.handleEditTextBlur, this.handleTitleChange,
            this.handleUrlChange, this.handleActionPress)
          :
          null
          }
        addItemButton={
          <ActionButton
            onPress={() => this.setState({ openAddItem: true })}
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
