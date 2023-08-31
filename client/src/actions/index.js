import userActions from './users.actions'
import operationActions from './operations.action'
import currenciesActions from './currencies.action'
import notificationsActions from './notifications.actions'
import reportsActions from './reports.actions'
import ticketsActions from './tickets.actions'
import chatActions from './chat.actions'
import employeesActions from './employees.action'

const actions = {
  users: userActions,
  operations: operationActions,
  currencies: currenciesActions,
  notifications: notificationsActions,
  reports: reportsActions,
  tickets: ticketsActions,
  chat: chatActions,
  employees: employeesActions,
}

export default actions
