import adminAPI from './admin.api'
import operationAPI from './operations.api'
import reportsAPI from './reports.api'
import notificationsAPI from './notifications.api'
import ticketAPI from './tickets.api'
import contentAPI from './content.api'
import articleAPI from './article.api'
import aboutAPI from './about.api'

const api = {
  admin: adminAPI,
  operations: operationAPI,
  reports: reportsAPI,
  notifications: notificationsAPI,
  tickets: ticketAPI,
  content: contentAPI,
  article: articleAPI,
  about: aboutAPI,
}

export default api
