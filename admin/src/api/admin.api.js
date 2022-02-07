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
}

export default adminAPI