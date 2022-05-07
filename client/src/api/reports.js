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
    console.log('close id:', id)
    return service().patch(`reports/close/${id}`)
  },
}

export default reportsAPI
