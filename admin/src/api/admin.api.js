import service from './service'

const adminAPI = {
    login(data){
        return service().post(`users/staff/login`, data)
    },
    logout() {
        return service().post('users/staff/logout')
    },
    sendPasswordResetLink(email) {
        return service().get(`users/password/reset?email=${email}`)
    },
    verifyAuthLink(data) {
        return service().patch(`users/verify`, data)
    },
    members(query) {
        let queryObj = {}
        for(let key in query) {
            if(key === 'isActive' || key === 'isProvider') {
                queryObj[key] = query[key]
            }else if(query[key]) {
                queryObj[key] = query[key]
            }
        }
        const queryString = new URLSearchParams(queryObj).toString()
        return service().get(`users/all?${queryString}`)
    },

    member(id) {
        return service().get(`users/me/${id}`)
    },
    toggle(id) {
        return service().patch(`users/activate/${id}`)
    },
    color(id, data) {
        return service().patch(`users/color/${id}`, data)
    },
    delete(id) {
        return service().delete(`users/${id}`)
    },
    role(id, role){
        const queryString = role 
        ? new URLSearchParams({role}).toString()
        : null
        return service().patch(`users/role/${id}?${queryString}`)
    },
    provider(data) {
        return service().post('users/provider', data)
    },
    info(){
        return service().get('users/info')
    },
    latest(){
        return service().get('users/latest')
    },
    tickets(){
        return service().get('users/tickets')
    },
    operations(){
        return service().get('users/operations')
    },
    reports(){
        return service().get('users/reports')
    }
}

export default adminAPI