import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import App from './App'
import './i18next'
import 'simplebar/dist/simplebar.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './App.scss'

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
