import adminReducer from './admin.reducers'
import notificationReducer from './notifications.reducer'
import operationsReducer from './operations.reducer'
import reportsReducer from './reports.reducer'
import ticketsReducer from './ticket.reducer'

export const globalReducer = {
    ...adminReducer,
    ...notificationReducer,
    ...operationsReducer,
    ...reportsReducer,
    ...ticketsReducer
}

