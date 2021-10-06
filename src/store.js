import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { createReducer } from "redux-orm";
import orm from "./model";
import thunk from 'redux-thunk';
import { offlineMiddleware } from './offline';

const rootReducer = combineReducers({
  orm: createReducer(orm),
});

const __DEV__ = process.env.NODE_ENV !== 'production';
let middleware = [applyMiddleware(thunk), offlineMiddleware]

if (window.__REDUX_DEVTOOLS_EXTENSION__ && __DEV__) {
  middleware = [...middleware, window.__REDUX_DEVTOOLS_EXTENSION__()]
}

const store = createStore(rootReducer, undefined, compose(...middleware));

export default store;