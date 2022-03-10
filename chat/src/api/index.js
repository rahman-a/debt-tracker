import service from './service'

const chatAPI = {
    createConversation(data){
        return service().post('new', data)
    },
    createRoom(data){
        return service().post('room', data)
    },
    updateRoom(conversationId, data){
        return service().patch(`${conversationId}`, data)
    },
    addMemberToRoom(conversationId, data) {
        return service().patch(`${conversationId}`, data)
    },
    removeMemberFromRoom(conversationId, data) {
        return service().delete(`${conversationId}`, data)
    },
    deleteRoom(conversationId) {
        return service().delete(`${conversationId}`)
    },
    listConversations() {
        return service().get()
    },
    createMessage(conversationId,data) {
        return service().post(`${conversationId}/messages/new`, data)
    },
    listConversationMessages(conversationId) {
        return service().get(`${conversationId}/messages`)
    },
    searchConversations(search){
        return service().get(`users?search=${search}`)
    }
}

export default chatAPI