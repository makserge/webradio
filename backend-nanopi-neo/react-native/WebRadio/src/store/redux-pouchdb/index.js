import AsyncStorage from '@react-native-community/async-storage';
import equal from 'deep-equal';
import 'array.from';
import PouchDB from './pouchdb';

import save from './Save';

import {
  DB_NAME,
  SERVER_HOST,
  DEFAULT_SERVER_HOST,
} from '../../constants/Common';

export const SET_REDUCER = 'redux-pouchdb/SET_REDUCER';
export const INIT = '@@redux-pouchdb/INIT';

const LOCAL_IDENTIFIER = Array(12)
  .fill(0)
  .map(() => {
    let char = Math.floor(Math.random() * 52);
    char += (char > 25) ? 71 : 65;
    return String.fromCharCode(char);
  })
  .join('');

let isInitialized = false;

let saveReducer;

async function getServer() {
  return new Promise((resolve) => {
    AsyncStorage.getItem(SERVER_HOST).then((value) => {
      if (value) {
        resolve(value);
      } else {
        resolve(DEFAULT_SERVER_HOST);
      }
    });
  });
}

async function init() {
  const server = await getServer();
  const localDB = new PouchDB(DB_NAME, { adapter: 'react-native-sqlite' });
  const remoteDB = new PouchDB(`${server}:5984/${DB_NAME}`);
  localDB.sync(remoteDB, {
    live: true,
    retry: true,
  });
  return localDB;
}

export async function initPersistentStore(store) {
  const db = await init();

  saveReducer = save(db, LOCAL_IDENTIFIER);
  const setReducer = (doc) => {
    const { _id, _rev, state } = doc;

    store.dispatch({
      type: SET_REDUCER,
      reducer: _id,
      state,
      _rev,
    });
  };

  db.allDocs({ include_docs: true }).then((res) => {
    const promises = res.rows.map(row => setReducer(row.doc));
    return Promise.all(promises);
  }).then(() => {
    isInitialized = true;
    store.dispatch({
      type: INIT,
    });

    return db.changes({
      include_docs: true,
      live: true,
      since: 'now',
    }).on('change', (change) => {
      if (change.doc.state) {
        setReducer(change.doc);
      }
    });
  }).catch(console.error.bind(console));
}

export const persistentReducer = (reducer, name) => {
  let lastState;
  let newName = name;
  newName = newName || reducer.name;

  return (state, action) => {
    if (action && action.type === SET_REDUCER
        && action.reducer === newName
        && action.state) {
      lastState = action.state;
      return reducer(action.state, action);
    }
    if (action && action.type === SET_REDUCER) {
      // Another reducer's state... ignore.
      return state;
    }

    const reducedState = reducer(state, action);

    if (isInitialized && !equal(reducedState, lastState, { strict: true })) {
      lastState = reducedState;
      saveReducer(newName, reducedState);
    }

    return reducedState;
  };
};
