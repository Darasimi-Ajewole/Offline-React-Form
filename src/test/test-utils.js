import { Provider } from 'react-redux'
import store from '../store'
import { render as rtlRender } from '@testing-library/react'

export const render = (component) => {
  rtlRender(
    <Provider store={store}>
      {component}
    </Provider>)
}
