import adminActions from './admin.actions'
import notificationActions from './notifications.actions'
import operationsActions from './operations.actions'
import reportsActions from './reports.actions'
import ticketActions from './tickets.actions'
import contentActions from './content.actions'
import articleActions from './article.actions'
import aboutActions from './about.actions'

const actions = {
  admin: adminActions,
  notifications: notificationActions,
  operations: operationsActions,
  reports: reportsActions,
  tickets: ticketActions,
  content: contentActions,
  article: articleActions,
  about: aboutActions,
}

export default actions
