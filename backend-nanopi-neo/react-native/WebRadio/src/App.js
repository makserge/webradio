import React, { Component } from 'react';
import {
  Text
} from 'react-native';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Container from './components/Container';

export default class App extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <Container>
          <Text>
            ffff
            
          </Text>
        </Container>
      </Provider>
    );
  }
}
