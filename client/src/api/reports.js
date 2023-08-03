import service from './service'

const reportsAPI = {
  index(query) {
    let queryString = ''
    if (query) {
      let queryObj = {}
      for (let key in query) {
        if (key === 'isActive' || key === 'notDue') {
          queryObj[key] = false
        } else {
          if (query[key]) {
            queryObj[key] = query[key]
          }
        }
      }
      queryString = '?' + new URLSearchParams(queryObj).toString()
      console.log('queryString: ', queryString)
    }

    return service().get(`reports${queryString}`)
  },

  update(id, query) {
    let queryString = ''
    if (query) {
      queryString = '?' + new URLSearchParams(query).toString()
    }
    return service().patch(`reports/${id}${queryString}`)
  },
  changeDueDate(id, date) {
    return service().patch(`reports/${id}/due`, date)
  },
  approveDueDate(id, date) {
    return service().patch(`reports/${id}/due/approve`, date)
  },
  close(id) {
    return service().patch(`reports/close/${id}`)
  },
  reportsData(data) {
    return service().post(`reports/generate_report`, data)
  },
  reportsPrint(data) {
    return service().post(`reports/print_report`, data)
  },
  getStripePublishableKey() {
    return service().get('reports/get_stripe_publishable_key')
  },
  getStripeClientSecretKey(data) {
    return service().post('reports/create_fine_intent', data)
  },
  finalizeFinePayment(data) {
    return service().post('reports/finalize_fine_payment', data)
  },
}

export default reportsAPI
