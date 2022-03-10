import adminActions from './admin.actions'
import notificationActions from './notifications.actions'
import operationsActions from './operations.actions'
import reportsActions from './reports.actions'
import ticketActions from './tickets.actions'
import chatActions from './chat.actions'

const actions = {
    admin:adminActions,
    notifications:notificationActions,
    operations:operationsActions,
    reports:reportsActions,
    tickets:ticketActions,
    chat:chatActions
}

export default actions