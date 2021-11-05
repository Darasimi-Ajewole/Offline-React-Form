import { Provider } from 'react-redux'
import { render as rtlRender } from '@testing-library/react'

export const render = (component, store) => {
  rtlRender(
    <Provider store={store}>
      {component}
    </Provider>)
  return store
}

export function isSuperObject(obj, subObj) {
  for (let [key, value] of Object.entries(subObj)) {
    if (obj[key] !== value) return false
  }
  return true
}