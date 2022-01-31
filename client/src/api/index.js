import userAPI from "./users"
import operationAPI from './operations'
import currenciesAPI from './currencies'
import notificationsAPI from "./notifications"
import reportsAPI from './reports'

const api = {
    users:userAPI,
    operations:operationAPI,
    currencies:currenciesAPI,
    notifications: notificationsAPI,
    reports:reportsAPI
}

export default api