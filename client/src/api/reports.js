import service from './service'

const reportsAPI = {
    
    index(query){
        console.log({query});
        let queryString = ''
        if(query) {
            let queryObj = {}
            for(let key in query) {
                if(key === 'isActive' || key === 'notDue') {
                    queryObj[key] = false
                }else {
                    if(query[key]) {
                        queryObj[key] = query[key]
                    }
                }
            }  
            queryString = '?' + new URLSearchParams(queryObj).toString()
        }

        return service().get(`reports${queryString}`)
    },
    
    update(id, query){
        let queryString = ''
        if(query) {
            queryString = '?' + new URLSearchParams(query).toString()
        }
        return service().patch(`reports/${id}${queryString}`)
    }
}

export default reportsAPI