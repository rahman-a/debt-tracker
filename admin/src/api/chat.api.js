import service from './service'

const chatAPI = {
    createConversation(data){
        return service().post('chat/new', data)
    },
    createRoom(data){
        return service().post('chat/room', data)
    },
    updateRoom(conversationId, data){
        return service().patch(`chat/${conversationId}`, data)
    },
    addMemberToRoom(conversationId, data) {
        return service().patch(`chat/${conversationId}`, data)
    },
    removeMemberFromRoom(conversationId, data) {
        return service().delete(`chat/${conversationId}`, data)
    },
    deleteRoom(conversationId) {
        return service().delete(`chat/${conversationId}`)
    },
    listConversations() {
        return service().get()
    },
    createMessage(conversationId,data) {
        return service().post(`chat/${conversationId}/messages/new`, data)
    },
    listConversationMessages(conversationId) {
        return service().get(`chat/${conversationId}/messages`)
    },
    searchConversations(search){
        return service().get(`chat/users?search=${search}`)
    }
}

export default chatAPI