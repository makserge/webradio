import React, { PropTypes, Component } from 'react';
import {
  ActionButton
} from 'react-native-material-ui';
import { connect } from 'react-redux';
import Container from '../components/Container';
import AppList from '../components/AppList';
import EditStreamDialog from '../components/EditStreamDialog';

class WebRadio extends Component {
  state = {
    openAddItem: false,
    title: '',
    titleError: '',
    url: '',
    urlError: ''
  }

  checkEmptyValue(value) {
    return value.trim() === '';
  }

  showEmptyValueError(key, value, error, message) {
    this.setState({
      [key]: value,
      [error]: this.checkEmptyValue(value) ? message : ''
    });
    console.log(this.state);
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
    }
    this.setState({
      title: '',
      titleError: '',
      url: '',
      urlError: '',
      openAddItem: false,
    });
  }

  render() {
    const {
      navigator,
      route,
      items
    } = this.props;
    const {
      openAddItem,
      title,
      titleError,
      url,
      urlError
    } = this.state;

    let addItemDialog;
    if (openAddItem) {
      addItemDialog = (
        <EditStreamDialog
          dialogTitle='Add stream'
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
    }

    return (
      <Container
        navigator={navigator}
        route={route}
        addItemDialog={addItemDialog}
        addItemButton={
          <ActionButton
            onPress={() => this.setState({ openAddItem: true })}
          />
        }
      >
      <AppList
        items={items}
      />
      </Container>
    );
  }
}

const propTypes = {
  navigator: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    items: state.webRadio
   };
};

WebRadio.propTypes = propTypes;
export default connect(mapStateToProps)(WebRadio);
