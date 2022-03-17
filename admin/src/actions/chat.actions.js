import constants from "../constants";
import api from '../api'
import i18next from "i18next";


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

const createRoom = (info) => async (dispatch, getState) => {
    dispatch({type:constants.chat.CREATE_ROOM_REQUEST})

    try {
        const {data} = await api.chat.createRoom(info)

        const {conversations} = getState().listConversations

        if(conversations) {
            const updatedConversations = [data.room,...conversations] 
            dispatch({
                type:constants.chat.LIST_CONVERSATION_SUCCESS,
                payload:updatedConversations
            })
        }
        
        dispatch({
            type:constants.chat.CREATE_ROOM_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.chat.CREATE_ROOM_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const updateRoom = (id, info) => async (dispatch, getState) => {
    dispatch({type:constants.chat.UPDATE_ROOM_REQUEST})

    try {
        const {data} = await api.chat.updateRoom(id, info)
        console.log('members: ', data);

        const {conversations} = getState().listConversations
        const {conversation} = getState().listMessages

        if(conversations) {
            
            let copiedConversations = JSON.parse(JSON.stringify(conversations)) 
 
            copiedConversations.forEach(conversation => {
                if(conversation._id === id) {
                    conversation.name = data.room.name 
                    conversation.image = data.room.image
                    conversation.members = data.room.members
                }
            })
            
            dispatch({
                type:constants.chat.LIST_CONVERSATION_SUCCESS,
                payload:copiedConversations
            })
        }

        if(conversation) {
            const lang = i18next.language
            
            let copiedConversation = JSON.parse(JSON.stringify(conversation)) 
            
            const members = data.room.members.map(member => ({
                _id:member._id,
                label:lang === 'ar' ? member.fullNameInArabic : member.fullNameInEnglish,
                image:member.avatar
            }))
            
            copiedConversation.metadata.name = data.room.name 
            copiedConversation.metadata.image = data.room.image
            copiedConversation.metadata.members = members
            
            dispatch({
                type:constants.chat.LIST_CONVERSATION_MESSAGES_SUCCESS,
                payload:copiedConversation
            })
        }
        
        dispatch({
            type:constants.chat.UPDATE_ROOM_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.chat.UPDATE_ROOM_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}


const deleteRoom = (id) => async (dispatch, getState) => {
    dispatch({type:constants.chat.DELETE_ROOM_REQUEST})

    try {
        const {data} = await api.chat.deleteRoom(id)

        const {conversations} = getState().listConversations

        if(conversations) {
            let copiedConversations = JSON.parse(JSON.stringify(conversations))
            
            copiedConversations = copiedConversations.filter(conversation => conversation._id !== data._id)
            
            dispatch({
                type:constants.chat.LIST_CONVERSATION_SUCCESS,
                payload:copiedConversations
            })
        }
        
        dispatch({
            type:constants.chat.DELETE_ROOM_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.chat.DELETE_ROOM_FAIL,
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
    console.log('markPeerMessagesAsReceived');
    try {
        const {data} = await api.chat.markAsReceived(undefined, info)
        const {conversation} = getState().listMessages
        console.log('conversation: ', conversation);
        
        if(conversation) {
            const copiedConversation = JSON.parse(JSON.stringify(conversation)) 
            copiedConversation.messages.forEach(message => {
                if(message.sender._id === info.sender) {
                    message.isReceived = true
                }
            }) 
            console.log('copiedConversation: ', copiedConversation);
            
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
        console.log('Create Message', data);
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
        console.log({error});
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
        console.log({error});
        dispatch({
            type:constants.chat.SEARCH_MEMBERS_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const reducer = {
    listConversation,
    createConversation,
    createRoom,
    updateRoom,
    deleteRoom,
    listMessages,
    createMessage,
    searchConversations,
    membersSearch,
    latestMessages,
    markAsReceived,
    markPeerMessagesAsReceived
}

export default reducer
