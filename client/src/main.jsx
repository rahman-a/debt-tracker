import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css'
import 'simplebar-react/dist/simplebar.min.css'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import store from './store'
import App from './App'
import './i18next'

if (import.meta.env.MODE === 'production') {
  disableReactDevTools()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>
)
