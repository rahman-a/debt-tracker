import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {globalReducer} from './reducers'

const middlewares = [thunk]

const mainReducer = combineReducers(globalReducer)

const rootReducer = (state, action) =>{
    if(action.type === 'ADMIN_LOGOUT_SUCCESS') {
        console.log({action:action.type});
        state = undefined
    }
    
    return mainReducer(state, action)
}


const staff = localStorage.getItem('staff')
? JSON.parse(localStorage.getItem('staff'))
: null

const isAdminAuth = () => {
    if(staff) {
        const today = new Date()
        const expiryDateLocalStorage = JSON.parse(localStorage.getItem('expiryAdAt'))
        const expiryDate = new Date(expiryDateLocalStorage)
        if(today < expiryDate) {
            return true
        }
    }
    localStorage.removeItem('staff')
    localStorage.removeItem('expiryAdAt')
    return false
}

const initState = {
    login:{
        staff,
        isAuth:isAdminAuth()
    }
}

const store = createStore (
    rootReducer,
    initState,
    composeWithDevTools(applyMiddleware(...middlewares))
)

export default store

