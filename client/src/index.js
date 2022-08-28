import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css'
import 'simplebar/dist/simplebar.min.css'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import store from './store'
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
