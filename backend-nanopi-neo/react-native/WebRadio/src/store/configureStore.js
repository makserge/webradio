import { createStore } from 'redux';
import PouchDB from 'pouchdb-react-native';

import rootReducer from '../reducers';

import { initPersistentStore } from './redux-pouchdb';

const localDB = new PouchDB('webradio');
const remoteDB = new PouchDB('http://10.0.3.2:5984/webradio');
localDB.sync(remoteDB, {
    live: true,
    retry: true,
    continuous: true,
  });

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState
  );

  initPersistentStore(store, localDB);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}
