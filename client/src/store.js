import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {globalReducer} from './reducers'

const middlewares = [thunk]

const reducer = combineReducers(globalReducer)

const userId = localStorage.getItem('uid')
? localStorage.getItem('uid')
: null

const user = localStorage.getItem('user')
? JSON.parse(localStorage.getItem('user'))
: null

const isUserAuth = () => {
    if(user) {
        const today = new Date()
        const expiryDateLocalStorage = JSON.parse(localStorage.getItem('expiryAt'))
        const expiryDate = new Date(expiryDateLocalStorage)
        if(today < expiryDate) {
            return true
        }
    }
    localStorage.removeItem('user')
    localStorage.removeItem('expiryAt')
    return false
}

const initState = {
    registerCredential:{userId},
    login:{
        user,
        isAuth:isUserAuth()
    }
}

const store = createStore(
    reducer,
    initState,
    composeWithDevTools(applyMiddleware(...middlewares))
)

export default store

