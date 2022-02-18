import service from './service'


const operationAPI = {
    index(query) {
        let queryObj = {}
        for(let key in query) {
            if(query[key]) {
                queryObj[key] = query[key]
            }
        }
        const queryString = new URLSearchParams(queryObj).toString() 
        return service().get(`operations/all?${queryString}`)
    },
    updateState(id, notification, state){
        return service().patch(`operations/${id}/${notification}?state=${state}`)
    }
}

export default operationAPI