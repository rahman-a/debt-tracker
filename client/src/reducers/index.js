import userReducers from './users.reducers'
import operationReducer from './operations.reducer'
import currenciesReducer from './currencies.reducer'
import notificationReducer from './notifications.reducer'
import reportsReducer from './reports.reducer'
import ticketsReducer from './tickets.reducer'
import chatReducer from './chat.reducer'

export const globalReducer = {
  ...userReducers,
  ...operationReducer,
  ...currenciesReducer,
  ...notificationReducer,
  ...reportsReducer,
  ...ticketsReducer,
  ...chatReducer,
}
