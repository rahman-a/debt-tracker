import userAPI from "./users"
import operationAPI from './operations'
import currenciesAPI from './currencies'
import notificationsAPI from "./notifications"

const api = {
    users:userAPI,
    operations:operationAPI,
    currencies:currenciesAPI,
    notifications: notificationsAPI
}

export default api