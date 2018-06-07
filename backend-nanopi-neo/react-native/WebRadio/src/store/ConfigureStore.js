import {
  createStore,
  applyMiddleware,
} from 'redux';

import createRootReducer from '../reducers';
import { navigation, screenTracking } from '../middleware/Navigation';
import { initPersistentStore } from './redux-pouchdb';

export default function configureStore(AppNavigator) {
  const rootReducer = createRootReducer(AppNavigator);
  const store = createStore(
    rootReducer,
    applyMiddleware(navigation, screenTracking),
  );

  initPersistentStore(store);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}
