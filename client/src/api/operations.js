import service from './service'

const operationAPI = {
    index(query){
        let queryObj = {}
        for(let key in query) {
            if(query[key]) {
                queryObj[key] = query[key]
            }
        }
        const queryString = new URLSearchParams(queryObj).toString()
        return service().get(`operations?${queryString}`)
    },
    findMutual(initiator, peer) {
        return service().get(`operations/mutual/${initiator}/${peer}`)
    },
    create(data){
        return service().post('operations/new', data)
    },
    getOne(id){
        return service().get(`operations/${id}`)
    },
    updateState(id, notification, state){
        const url = notification 
        ? `operations/${id}/${notification}?state=${state}`
        : `operations/${id}?state=${state}`
        return service().patch(url)
    }
}

export default operationAPI