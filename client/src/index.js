import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, HashRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import 'simplebar/dist/simplebar.min.css';
import store from './store'
import App from './App';
import './i18next'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
