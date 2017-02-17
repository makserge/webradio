import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';

import WebRadio from './containers/WebRadio';
import FmRadio from './containers/FmRadio';
import AudioPlayer from './containers/AudioPlayer';
import Bluetooth from './containers/Bluetooth';
import AirPlay from './containers/AirPlay';
import LineIn from './containers/LineIn';
import Settings from './containers/Settings';
import configureStore from './store/configureStore';

//Needed for React Developer Tools
window.React = React;

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={WebRadio}/>
      <Route path="/webradio" component={WebRadio}/>
      <Route path="/fmradio" component={FmRadio}/>
      <Route path="/audioplayer/tracks" component={AudioPlayer}/>
      <Route path="/audioplayer/playlists" component={AudioPlayer}/>
      <Route path="/audioplayer/folders" component={AudioPlayer}/>
      <Route path="/bluetooth" component={Bluetooth}/>
      <Route path="/airplay" component={AirPlay}/>
      <Route path="/linein" component={LineIn}/>
      <Route path="/settings" component={Settings}/>
    </Router>
  </Provider>,
  document.getElementById("root")
);
