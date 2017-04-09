import React, { PropTypes, Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import {
  COLOR,
  Icon,
} from 'react-native-material-ui';
import {
  TabViewAnimated,
  TabBar
} from 'react-native-tab-view';
import Container from '../components/Container';
import uiTheme from '../../MaterialUiTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: uiTheme.palette.primaryColor,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    backgroundColor: uiTheme.palette.accentColor,
  },
});

class AudioPlayer extends Component {
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'Playlist', icon: 'playlist-play' },
      { key: '2', title: 'Playback', icon: 'audiotrack' },
    ],
  };

  handleChangeTab = (index) => {
    this.setState({ index });
  };

  renderIcon = ({ route }: any) => (
    <Icon
      name={route.icon}
      size={24}
      color={COLOR.white}
    />
  );

  renderHeader = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      renderIcon={this.renderIcon}
      style={styles.tabBar}
    />
  );

  renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return <View style={[styles.page, { backgroundColor: '#ff0000' }]} />;
      case '2':
        return <View style={[styles.page, { backgroundColor: '#673ab7' }]} />;
      default:
        return null;
    }
  };

  render() {
    const { navigator, route } = this.props;

    return (
      <Container
        navigator={navigator}
        route={route}
      >
        <TabViewAnimated
          style={styles.container}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderHeader={this.renderHeader}
          onRequestChangeTab={this.handleChangeTab}
        />
      </Container>
    );
  }
}

const propTypes = {
  navigator: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

AudioPlayer.propTypes = propTypes;
export default AudioPlayer;
