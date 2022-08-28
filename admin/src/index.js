import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import 'simplebar/dist/simplebar.min.css'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import App from './App'
import './i18next'

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools()
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
