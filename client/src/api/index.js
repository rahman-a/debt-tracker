import userAPI from './users'
import operationAPI from './operations'
import currenciesAPI from './currencies'
import notificationsAPI from './notifications'
import reportsAPI from './reports'
import ticketsAPI from './tickets'
import chatAPI from './chat.api'

const api = {
  users: userAPI,
  operations: operationAPI,
  currencies: currenciesAPI,
  notifications: notificationsAPI,
  reports: reportsAPI,
  tickets: ticketsAPI,
  chat: chatAPI,
}

export default api
