import service from "./service";

const userAPI = {
    registerCredential(data) {
        return service().post('users/register', data)
    },
    registerInfo(id, data) {
        return service().patch(`users/register/${id}`, data)
    },
    registerDocuments(id, data) {
        return service().patch(`users/register/documents/${id}`, data)
    },
    sendVerifyCodeToPhone(id, email) {
        const url = !id && email 
        ? `users/phone?email=${email}`
        : `users/phone/${id}`
        return service().get(url)
    },
    sendVerifyEmailLink(id) {
        return service().get(`users/email/${id}`)
    },
    sendPasswordResetLink(email) {
        return service().get(`users/password/reset?email=${email}`)
    },
    verifyPhoneCode(id, code, email) {
        const url = !id && email
        ? `users/phone/verify?code=${code}&email=${email}`
        : `users/phone/verify/${id}?code=${code}`
        return service().patch(url)
    },
    verifyAuthLink(data) {
        return service().patch(`users/verify`, data)
    },
    getUserProfile(){
        return service().get('users/me')
    },
    loginInit(data){
        return service().post('users/login', data)
    },
    sendLoginCode(id) {
        return service().get(`users/login/code/new/${id}`)
    },
    updatePassword(data) {
        return service().patch('users/password/update', data)
    },
    login(id, data){
        return service().patch(`users/login/code/verify/${id}`, data)
    },
    logout() {
        return service().post('users/logout')
    }
}

export default userAPI