import adminReducer from './admin.reducers'
import notificationReducer from './notifications.reducer'
import operationsReducer from './operations.reducer'
import reportsReducer from './reports.reducer'
import ticketsReducer from './ticket.reducer'
import contentReducer from './content.reducer'
import articleReducer from './article.reducer'
import aboutReducer from './about.reducer'

export const globalReducer = {
  ...adminReducer,
  ...notificationReducer,
  ...operationsReducer,
  ...reportsReducer,
  ...ticketsReducer,
  ...contentReducer,
  ...articleReducer,
  ...aboutReducer,
}
