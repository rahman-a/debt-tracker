import userReducers from './users.reducers'
import operationReducer from './operations.reducer'
import currenciesReducer  from './currencies.reducer'
import notificationReducer from './notifications.reducer'

export const globalReducer = {
    ...userReducers,
    ...operationReducer,
    ...currenciesReducer,
    ...notificationReducer
}