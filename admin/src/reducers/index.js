import adminReducer from './admin.reducers'
import notificationReducer from './notifications.reducer'

export const globalReducer = {
    ...adminReducer,
    ...notificationReducer
}

