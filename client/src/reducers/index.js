import userReducers from './users.reducers'
import operationReducer from './operations.reducer'

export const globalReducer = {
    ...userReducers,
    ...operationReducer
}