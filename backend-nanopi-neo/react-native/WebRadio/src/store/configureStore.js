import { createStore, applyMiddleware } from 'redux';

import rootReducer from '../reducers';
import navigation from '../middleware/navigation';

import { initPersistentStore } from './redux-pouchdb';

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    applyMiddleware(navigation),
    initialState,
  );

  initPersistentStore(store);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}
