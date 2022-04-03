import service from './service'

const chatAPI = {
    createConversation(data){
        return service().post('chat/new', data)
    },
    listConversations() {
        return service().get('chat')
    },
    createMessage(conversationId,data) {
        return service().post(`chat/${conversationId}/messages/new`, data)
    },
    listConversationMessages(conversationId) {
        return service().get(`chat/${conversationId}/messages`)
    },
    searchConversations(search){
        
        return service().get(`chat/users?search=${search}`)
    },
    latest() {
        return service().get('chat/latest')
    },
    markAsReceived(id, data) {
        const url = id 
        ? `chat/messages/${id}`
        : 'chat/messages/bulk?isBulk=true'
        return service().patch(url, data)
    }
}

export default chatAPI