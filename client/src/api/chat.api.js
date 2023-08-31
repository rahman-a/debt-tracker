import service from './service'

const chatAPI = {
  searchUser(name) {
    return service().get(`/chat/users?name=${name}`)
  },
}

export default chatAPI
