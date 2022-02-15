import service from './service'


const reportsAPI = {
    index(query) {
        let queryObj = {}
        for(let key in query) {
            if(key === 'isActive' || key === 'isDue') {
                queryObj[key] = query[key]
            }else if(query[key]) {
                queryObj[key] = query[key]
            }
        }
        const queryString = new URLSearchParams(queryObj).toString() 
        console.log({queryString});
        return service().get(`reports/all?${queryString}`)
    },
    update(id, query) {
        const queryString = new URLSearchParams(query).toString()
        return service().patch(`reports/${id}?${queryString}`)
    },
    close(id) {
        return service().patch(`reports/close/${id}`)
    }
}

export default reportsAPI