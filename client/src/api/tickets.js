import service from './service'


const ticketsAPI = {
    index(id, query) {
        let queryObj = {}
        for(let key in query) {
            if(key === 'isOpen') {
                queryObj[key] = query[key]
            }else if(query[key]) {
                queryObj[key] = query[key]
            }
        }
        const queryString = new URLSearchParams(queryObj).toString()
        return service().get(`tickets/member/${id}?${queryString}`)
    },
    create(data) {
        return service().post(`tickets/new`, data)
    },
    getTicket(id) {
        return service().get(`tickets/${id}`)
    },
    updateStatus(id) {
        return service().patch(`tickets/${id}/status`)
    },
    addReplay(id, data) {
        return service().patch(`tickets/${id}/response`, data)
    }
}

export default ticketsAPI