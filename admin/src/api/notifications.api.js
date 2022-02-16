import service from './service'

const notificationsAPI = {
    index(query) {
        let queryObj = {}
        for(let key in query) {
            if(query[key]) {
                queryObj[key] = query[key]
            }
        }
        const queryString = new URLSearchParams(queryObj).toString()
        return service().get(`notifications?${queryString}`)
    },
    new(data){
        return service().post('notifications/new', data)
    },
    updateState(id) {
        return service().patch(`notifications/${id}`)
    },
    push(){
        return service().get('notifications/push')
    }
}

export default notificationsAPI