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

        const {conversations} = getState().listConversations

        if(conversations) {
            let copiedConversations = [...conversations] 
            
            copiedConversations.forEach(conversation => {
                if(conversation._id === id) {
                    for(let key in conversation) {
                        conversation[key] = data.conversation[key]
                    }
                }
            })
            
            dispatch({
                type:constants.chat.LIST_CONVERSATION_SUCCESS,
                payload:copiedConversations
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
            let copiedConversations = [...conversations] 
            
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

const addMemberToRoom = (id, info) => async (dispatch, getState) => {
    dispatch({type:constants.chat.ADD_MEMBER_TO_ROOM_REQUEST})

    try {
        const {data} = await api.chat.addMemberToRoom(id, info) 
        dispatch({
            type:constants.chat.ADD_MEMBER_TO_ROOM_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.chat.ADD_MEMBER_TO_ROOM_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const removeMemberFromRoom = (id, info) => async (dispatch, getState) => {
    dispatch({type:constants.chat.REMOVE_MEMBER_FROM_ROOM_REQUEST})

    try {
        const {data} = await api.chat.removeMemberFromRoom(id, info) 
        dispatch({
            type:constants.chat.REMOVE_MEMBER_FROM_ROOM_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.chat.REMOVE_MEMBER_FROM_ROOM_FAIL,
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
            payload:data.messages
        })
    } catch (error) {
        dispatch({
            type:constants.chat.LIST_CONVERSATION_MESSAGES_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const createMessage = (id, info) => async (dispatch, getState) => {
    dispatch({type:constants.chat.CREATE_MESSAGE_REQUEST})

    try {
        const {data} = await api.chat.createMessage(id, info) 
        
        const {messages} = getState().listMessages
        if(messages) {
            const updateMessages = [...messages, data.message]
            dispatch({
                type:constants.chat.LIST_CONVERSATION_MESSAGES_SUCCESS,
                payload:updateMessages
            })
        }
        
        dispatch({
            type:constants.chat.CREATE_MESSAGE_SUCCESS,
            payload:data.message
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
    console.log({search});
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

const reducer = {
    listConversation,
    createConversation,
    createRoom,
    updateRoom,
    deleteRoom,
    addMemberToRoom,
    removeMemberFromRoom,
    listMessages,
    createMessage,
    searchConversations
}

export default reducer
