import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { globalReducer } from './reducers'

const middlewares = [thunk]

const mainReducer = combineReducers(globalReducer)

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STORE') {
    const excluded = [
      'listSliders',
      'getAboutUs',
      'getContactUs',
      'listNews',
      'listSocial',
    ]
    for (const key in state) {
      if (!excluded.includes(key)) {
        state[key] = undefined
      }
    }
  }

  return mainReducer(state, action)
}

const user = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null

const isUserAuth = () => {
  if (user) {
    const today = new Date()
    const expiryDateLocalStorage = JSON.parse(localStorage.getItem('expiryAt'))
    const expiryDate = new Date(expiryDateLocalStorage)
    if (today < expiryDate) {
      return true
    }
  }
  localStorage.removeItem('user')
  localStorage.removeItem('expiryAt')
  return false
}

const initState = {
  login: {
    user,
    isAuth: isUserAuth(),
  },
}

const devTools =
  process.env.NODE_ENV === 'production'
    ? applyMiddleware(...middlewares)
    : composeWithDevTools(applyMiddleware(...middlewares))

const store = createStore(rootReducer, initState, devTools)

export default store
