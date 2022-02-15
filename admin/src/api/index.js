import adminAPI from "./admin.api"
import operationAPI from './operations.api'
import reportsAPI from "./reports.api"

const api = {
    admin:adminAPI,
    operations:operationAPI,
    reports:reportsAPI
}

export default api