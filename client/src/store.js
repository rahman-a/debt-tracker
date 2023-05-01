import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { globalReducer } from './reducers'

const middlewares = [thunk]

const mainReducer = combineReducers(globalReducer)

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STORE') {
    for (const key in state) {
      state[key] = undefined
    }
  }

  return mainReducer(state, action)
}

const initState = {}

const devTools =
  process.env.NODE_ENV === 'production'
    ? applyMiddleware(...middlewares)
    : composeWithDevTools(applyMiddleware(...middlewares))

const store = createStore(rootReducer, initState, devTools)

export default store
