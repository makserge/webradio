import { createStore, applyMiddleware } from 'redux';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

import rootReducer from '../reducers';
import navigation from '../middleware/navigation';

import { initPersistentStore } from './redux-pouchdb';

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.navigation,
);

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    applyMiddleware(middleware, navigatiion),
    initialState
  );

  initPersistentStore(store);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}
