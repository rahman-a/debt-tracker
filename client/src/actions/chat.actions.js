import constants from "../constants";
import api from '../api'

const listConversation = () => async dispatch => {
    dispatch({type: constants.chat.LIST_CONVERSATION_REQUEST}) 
    try {
        const {data} = await api.chat.listConversations()
        dispatch({
            type:constants.chat.LIST_CONVERSATION_SUCCESS,
            payload:data.conversations
        })
    } catch (error) {
        dispatch({
            type:constants.chat.LIST_CONVERSATION_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}


const createConversation = (info) => async (dispatch, getState) => {
    dispatch({type:constants.chat.CREATE_CONVERSATION_REQUEST})

    try {
        const {data} = await api.chat.createConversation(info)

        const {conversations} = getState().listConversations

        if(conversations) {
            const updatedConversations = [data.conversation,...conversations] 
            dispatch({
                type:constants.chat.LIST_CONVERSATION_SUCCESS,
                payload:updatedConversations
            })
        }
        
        dispatch({
            type:constants.chat.CREATE_CONVERSATION_SUCCESS,
            payload:data.success
        })
    } catch (error) {
        dispatch({
            type:constants.chat.CREATE_CONVERSATION_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const initiateConversation = (id) => async (dispatch) => {
    dispatch({type:constants.chat.INITIATE_CONVERSATION_REQUEST})

    try {
        const {data} = await api.chat.initiateConversation(id)
        dispatch({
            type:constants.chat.INITIATE_CONVERSATION_SUCCESS,
            payload:data.conversation
        })
    } catch (error) {
        dispatch({
            type:constants.chat.INITIATE_CONVERSATION_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const listMessages = (id) => async (dispatch, getState) => {
    dispatch({type:constants.chat.LIST_CONVERSATION_MESSAGES_REQUEST})

    try {
        const {data} = await api.chat.listConversationMessages(id) 
        
        dispatch({
            type:constants.chat.LIST_CONVERSATION_MESSAGES_SUCCESS,
            payload:data.conversation
        })
    } catch (error) {
        dispatch({
            type:constants.chat.LIST_CONVERSATION_MESSAGES_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const latestMessages = _ => async dispatch => {
    dispatch({type:constants.chat.LATEST_MESSAGES_REQUEST})

    try {
        const {data} = await api.chat.latest() 
        
        dispatch({
            type:constants.chat.LATEST_MESSAGES_SUCCESS,
            messages:data.messages,
            count:data.count
        })
    } catch (error) {
        dispatch({
            type:constants.chat.LATEST_MESSAGES_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const markAsReceived = (id) => async (dispatch, getState) => {
    dispatch({type:constants.chat.MARK_MESSAGE_AS_RECEIVED_REQUEST})

    try {
        const {data} = await api.chat.markAsReceived(id)
        const {count, messages} = getState().latestMessages 
        if(messages) {

            dispatch({
                type:constants.chat.LATEST_MESSAGES_SUCCESS,
                messages:messages,
                count:count ? count - 1 : 0
            })
        }

        dispatch({
            type:constants.chat.MARK_MESSAGE_AS_RECEIVED_SUCCESS,
            payload:data.success
        })
    } catch (error) {
        dispatch({
            type:constants.chat.MARK_MESSAGE_AS_RECEIVED_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const markPeerMessagesAsReceived = (info) => async (dispatch, getState) => {
    dispatch({type:constants.chat.MARK_PEER_MESSAGES_AS_RECEIVED_REQUEST})
    try {
        const {data} = await api.chat.markAsReceived(undefined, info)
        const {conversation} = getState().listMessages
        
        if(conversation) {
            const copiedConversation = JSON.parse(JSON.stringify(conversation)) 
            copiedConversation.messages.forEach(message => {
                if(message.sender._id === info.sender) {
                    message.isReceived = true
                }
            }) 
            
            dispatch({
                type:constants.chat.LIST_CONVERSATION_MESSAGES_SUCCESS,
                payload:copiedConversation
            })
        }
        
        dispatch({
            type:constants.chat.MARK_PEER_MESSAGES_AS_RECEIVED_SUCCESS,
            payload:data.success
        })
    } catch (error) {
        dispatch({
            type:constants.chat.MARK_PEER_MESSAGES_AS_RECEIVED_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const createMessage = (id, info) => async (dispatch, getState) => {
    dispatch({type:constants.chat.CREATE_MESSAGE_REQUEST})

    try {
        const {data} = await api.chat.createMessage(id, info) 
        
        dispatch({
            type:constants.chat.CREATE_MESSAGE_SUCCESS,
            payload:data.success
        })

    } catch (error) {
        dispatch({
            type:constants.chat.CREATE_MESSAGE_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}


const searchConversations = search => async dispatch => {
    dispatch({type:constants.chat.SEARCH_CONVERSATIONS_REQUEST})
    
    try {
        const {data} = await api.chat.searchConversations(search)
        
        
        dispatch({
            type:constants.chat.SEARCH_CONVERSATIONS_SUCCESS,
            payload:data.output
        })
    } catch (error) {
        
        dispatch({
            type:constants.chat.SEARCH_CONVERSATIONS_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const membersSearch = search => async dispatch => {
    dispatch({type:constants.chat.SEARCH_MEMBERS_REQUEST})

    try {
        const {data} = await api.chat.searchConversations(search)
        dispatch({
            type:constants.chat.SEARCH_MEMBERS_SUCCESS,
            payload:data.output
        })
    } catch (error) {
        
        dispatch({
            type:constants.chat.SEARCH_MEMBERS_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const createSupportGroup = () => async (dispatch) => {
    dispatch({type:constants.chat.CREATE_SUPPORT_GROUP_REQUEST})

    try {
        const {data} = await api.chat.createSupportGroup()

        dispatch({
            type:constants.chat.CREATE_SUPPORT_GROUP_SUCCESS,
            payload:data.conversation
        })

        setTimeout(() => {
            dispatch({type:constants.chat.CREATE_SUPPORT_GROUP_RESET})
        },250)
        
    } catch (error) {
        dispatch({
            type:constants.chat.CREATE_SUPPORT_GROUP_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const reducer = {
    listConversation,
    createConversation,
    listMessages,
    createMessage,
    searchConversations,
    membersSearch,
    latestMessages,
    markAsReceived,
    markPeerMessagesAsReceived,
    initiateConversation,
    createSupportGroup
}

export default reducer
