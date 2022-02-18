import adminAPI from "./admin.api"
import operationAPI from './operations.api'
import reportsAPI from "./reports.api"
import notificationsAPI from './notifications.api'
import ticketAPI from './tickets.api'

const api = {
    admin:adminAPI,
    operations:operationAPI,
    reports:reportsAPI,
    notifications:notificationsAPI,
    tickets:ticketAPI
}

export default api