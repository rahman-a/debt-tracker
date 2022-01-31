import userActions from './users.actions'
import operationActions from './operations.action'
import currenciesActions from './currencies.action'
import notificationsActions from './notifications.actions'
import reportsActions from './reports.actions' 

const actions = {
    users:userActions,
    operations:operationActions,
    currencies:currenciesActions,
    notifications:notificationsActions,
    reports: reportsActions
}

export default actions