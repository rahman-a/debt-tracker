import service from './service'

const notificationsAPI = {
    index(query) {
        const queryString = new URLSearchParams(query).toString()
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