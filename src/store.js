import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from "redux-devtools-extension";//is a utility provided by the Redux DevTools Extension that enhances the store's capabilities

import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];

export const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
