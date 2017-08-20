import { createStore, applyMiddleware } from 'redux';
import PouchDB from 'pouchdb-react-native';

import rootReducer from '../reducers';
import navigation from '../middleware/navigation';

import { initPersistentStore } from './redux-pouchdb';

const localDB = new PouchDB('webradio');
const remoteDB = new PouchDB('http://192.168.31.193:5984/webradio');
localDB.sync(remoteDB, {
    live: true,
    retry: true,
    continuous: true,
  });

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    applyMiddleware(navigation),
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
