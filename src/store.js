import { createStore, compose, combineReducers } from 'redux'
import { createReducer } from "redux-orm";
import orm from "./model";
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';

const rootReducer = combineReducers({
  orm: createReducer(orm),
});

const effect = (effectData, _action) => {
  const defaultRequest = offlineConfig.effect
  const { customRequest } = effectData
  if (customRequest) return customRequest(effectData)
  return defaultRequest(effectData)
}

let middleware = [
  offline({ ...offlineConfig, effect }),
]
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  middleware = [...middleware, window.__REDUX_DEVTOOLS_EXTENSION__()]
}


const store = createStore(rootReducer, undefined, compose(...middleware));

export default store;