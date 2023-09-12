import service from './service'

const userAPI = {
  checkInfo(data) {
    return service().post(`users/check-if-exist`, data)
  },
  getUserProfile() {
    return service().get('users/me')
  },
  updatePassword(data) {
    return service().patch('users/password/update', data)
  },
  sendVerifyCodeToPhone(email) {
    return service().get(`users/phone?email=${email}`)
  },
  verifyPhoneCode(code, email) {
    return service().patch(`users/phone/verify?code=${code}&email=${email}`)
  },
  sendPasswordResetLink(email) {
    return service().get(`users/password/reset?email=${email}`)
  },
  sendLoginCredentials(data) {
    return service().post('users/login', data)
  },
  sendLoginCode(id) {
    return service().get(`users/login/code/new/${id}`)
  },
  verifyLoginCode(id, data) {
    return service().patch(`users/login/code/verify/${id}`, data)
  },
  isLoggedIn(token) {
    const url = token
      ? `users/is-logged-in?token=${token}`
      : 'users/is-logged-in'
    return service().get(url)
  },
  logout() {
    return service().post('users/logout')
  },
  search(query) {
    const queryString = new URLSearchParams(query).toString()
    return service().get(`users/search?${queryString}`)
  },
  updateAddressAndPhone(data) {
    return service().patch(`users/info/update`, data)
  },
  updateDocuments(id, data, type) {
    return service().patch(`users/${id}/documents?type=${type}`, data)
  },
  sendContact(data) {
    return service().post('users/contact', data)
  },
  updatePhoneNumber(id, phone) {
    return service().patch(`users/${id}/phone/update?phone=${phone}`)
  },
  getMutuals(id, skip) {
    return service().get(`users/${id}/clients?skip=${skip}`)
  },
}

export default userAPI
