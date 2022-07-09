import { createStore, compose, combineReducers, applyMiddleware } from "redux";
import { createReducer } from "redux-orm";
import orm from "./model";
import thunk from "redux-thunk";
import { offlineMiddleware } from "./offline";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: typeof compose;
  }
}

const rootReducer = combineReducers({
  orm: createReducer(orm),
});

let middleware = [applyMiddleware(thunk), offlineMiddleware];

const __DEV__ = process.env.NODE_ENV !== "production";
if (window.__REDUX_DEVTOOLS_EXTENSION__ && __DEV__) {
  middleware = [...middleware, window.__REDUX_DEVTOOLS_EXTENSION__()];
}

const store = createStore(rootReducer, undefined, compose(...middleware));

export const createTestStore = () => {
  return createStore(rootReducer, undefined, compose(...middleware));
};
export default store;
