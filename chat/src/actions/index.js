import constants from "../constants";
import api from '../api'



const listConversation = () => async dispatch => {
    dispatch({type: constants.LIST_CONVERSATION_REQUEST}) 

    try {
        const {data} = await api.listConversations()
        dispatch({
            type:constants.LIST_CONVERSATION_SUCCESS,
            payload:data.conversations
        })
    } catch (error) {
        dispatch({
            type:constants.LIST_CONVERSATION_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}


const createConversation = (info) => async (dispatch, getState) => {
    dispatch({type:constants.CREATE_CONVERSATION_REQUEST})

    try {
        const {data} = await api.createConversation(info)

        const {conversations} = getState().listConversations

        if(conversations) {
            const updatedConversations = [data.conversation,...conversations] 
            dispatch({
                type:constants.LIST_CONVERSATION_SUCCESS,
                payload:updatedConversations
            })
        }
        
        dispatch({
            type:constants.CREATE_CONVERSATION_SUCCESS,
            payload:data.success
        })
    } catch (error) {
        dispatch({
            type:constants.CREATE_CONVERSATION_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const createRoom = (info) => async (dispatch, getState) => {
    dispatch({type:constants.CREATE_ROOM_REQUEST})

    try {
        const {data} = await api.createRoom(info)

        const {conversations} = getState().listConversations

        if(conversations) {
            const updatedConversations = [data.room,...conversations] 
            dispatch({
                type:constants.LIST_CONVERSATION_SUCCESS,
                payload:updatedConversations
            })
        }
        
        dispatch({
            type:constants.CREATE_ROOM_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.CREATE_ROOM_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const updateRoom = (id, info) => async (dispatch, getState) => {
    dispatch({type:constants.UPDATE_ROOM_REQUEST})

    try {
        const {data} = await api.updateRoom(id, info)

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
                type:constants.LIST_CONVERSATION_SUCCESS,
                payload:copiedConversations
            })
        }
        
        dispatch({
            type:constants.UPDATE_ROOM_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.UPDATE_ROOM_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}


const deleteRoom = (id) => async (dispatch, getState) => {
    dispatch({type:constants.DELETE_ROOM_REQUEST})

    try {
        const {data} = await api.deleteRoom(id)

        const {conversations} = getState().listConversations

        if(conversations) {
            let copiedConversations = [...conversations] 
            
            copiedConversations = copiedConversations.filter(conversation => conversation._id !== data._id)
            
            dispatch({
                type:constants.LIST_CONVERSATION_SUCCESS,
                payload:copiedConversations
            })
        }
        
        dispatch({
            type:constants.DELETE_ROOM_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.DELETE_ROOM_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const addMemberToRoom = (id, info) => async (dispatch, getState) => {
    dispatch({type:constants.ADD_MEMBER_TO_ROOM_REQUEST})

    try {
        const {data} = await api.addMemberToRoom(id, info) 
        dispatch({
            type:constants.ADD_MEMBER_TO_ROOM_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.ADD_MEMBER_TO_ROOM_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const removeMemberFromRoom = (id, info) => async (dispatch, getState) => {
    dispatch({type:constants.REMOVE_MEMBER_FROM_ROOM_REQUEST})

    try {
        const {data} = await api.removeMemberFromRoom(id, info) 
        dispatch({
            type:constants.REMOVE_MEMBER_FROM_ROOM_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.REMOVE_MEMBER_FROM_ROOM_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}


const listMessages = (id) => async (dispatch, getState) => {
    dispatch({type:constants.LIST_CONVERSATION_MESSAGES_REQUEST})

    try {
        const {data} = await api.listConversationMessages(id) 
        dispatch({
            type:constants.LIST_CONVERSATION_MESSAGES_SUCCESS,
            payload:data.messages
        })
    } catch (error) {
        dispatch({
            type:constants.LIST_CONVERSATION_MESSAGES_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const createMessage = (id, info) => async (dispatch, getState) => {
    dispatch({type:constants.CREATE_MESSAGE_REQUEST})

    try {
        const {data} = await api.createMessage(id, info) 
        
        const {messages} = getState().listMessages
        if(messages) {
            const updateMessages = [...messages, data.message]
            dispatch({
                type:constants.LIST_CONVERSATION_MESSAGES_SUCCESS,
                payload:updateMessages
            })
        }
        
        dispatch({
            type:constants.CREATE_MESSAGE_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.CREATE_MESSAGE_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}


const searchConversations = search => async dispatch => {
    dispatch({type:constants.SEARCH_CONVERSATIONS_REQUEST})

    try {
        const {data} = await api.searchConversations(search)
        dispatch({
            type:constants.SEARCH_CONVERSATIONS_SUCCESS,
            payload:data.output
        })
    } catch (error) {
        dispatch({
            type:constants.SEARCH_CONVERSATIONS_FAIL,
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
