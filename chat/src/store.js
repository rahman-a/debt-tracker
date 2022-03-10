import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import globalReducer from './reducer'

const middlewares = [thunk]

const mainReducer = combineReducers(globalReducer)

const rootReducer = (state, action) =>{
    if(action.type === 'USER_LOGOUT_SUCCESS') {
        state = undefined
    }
    
    return mainReducer(state, action)
}


const initState = {
    
}

const store = createStore (
    rootReducer,
    initState,
    composeWithDevTools(applyMiddleware(...middlewares))
)

export default store

