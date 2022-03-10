import constants from "../constants";


const createConversation = (state, action) => {
    const cases = {
        [constants.CREATE_CONVERSATION_REQUEST]: 
        {
            loading:false,
            error:null
        },
        [constants.CREATE_CONVERSATION_SUCCESS]: 
        {
            loading:false,
            error:null,
            success:action.payload
        },
        [constants.CREATE_CONVERSATION_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.CREATE_CONVERSATION_RESET]: 
        {
            loading:false,
            error:action.payload,
            success:null
        }
    }

    return cases[action.type] || {...state}
}

const createRoom = (state, action) => {
    const cases = {
        [constants.CREATE_ROOM_REQUEST]: 
        {
            loading:false,
            error:null
        },
        [constants.CREATE_ROOM_SUCCESS]: 
        {
            loading:false,
            error:null,
            message:action.payload
        },
        [constants.CREATE_ROOM_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.CREATE_ROOM_RESET]: 
        {
            loading:false,
            error:action.payload,
            message:null
        }
    }

    return cases[action.type] || {...state}
}

const updateRoom = (state, action) => {
    const cases = {
        [constants.UPDATE_ROOM_REQUEST]: 
        {
            loading:false,
            error:null
        },
        [constants.UPDATE_ROOM_SUCCESS]: 
        {
            loading:false,
            error:null,
            message:action.payload
        },
        [constants.UPDATE_ROOM_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.UPDATE_ROOM_RESET]: 
        {
            loading:false,
            error:action.payload,
            message:null
        }
    }

    return cases[action.type] || {...state}
}

const deleteRoom = (state, action) => {
    const cases = {
        [constants.UPDATE_ROOM_REQUEST]: 
        {
            loading:false,
            error:null
        },
        [constants.UPDATE_ROOM_SUCCESS]: 
        {
            loading:false,
            error:null,
            message:action.payload
        },
        [constants.UPDATE_ROOM_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.UPDATE_ROOM_RESET]: 
        {
            loading:false,
            error:action.payload,
            message:null
        }
    }

    return cases[action.type] || {...state}
}

const addMemberToRoom = (state, action) => {
    const cases = {
        [constants.ADD_MEMBER_TO_ROOM_REQUEST]: 
        {
            loading:false,
            error:null
        },
        [constants.ADD_MEMBER_TO_ROOM_SUCCESS]: 
        {
            loading:false,
            error:null,
            message:action.payload
        },
        [constants.ADD_MEMBER_TO_ROOM_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.ADD_MEMBER_TO_ROOM_RESET]: 
        {
            loading:false,
            error:action.payload,
            message:null
        }
    }

    return cases[action.type] || {...state}
}

const removeMemberFromRoom = (state, action) => {
    const cases = {
        [constants.REMOVE_MEMBER_FROM_ROOM_REQUEST]: 
        {
            loading:false,
            error:null
        },
        [constants.REMOVE_MEMBER_FROM_ROOM_SUCCESS]: 
        {
            loading:false,
            error:null,
            message:action.payload
        },
        [constants.REMOVE_MEMBER_FROM_ROOM_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.REMOVE_MEMBER_FROM_ROOM_RESET]: 
        {
            loading:false,
            error:action.payload,
            message:null
        }
    }

    return cases[action.type] || {...state}
}

const listConversations = (state, action) => {
    const cases = {
        [constants.LIST_CONVERSATION_REQUEST]: 
        {
            loading:false,
            error:null
        },
        [constants.LIST_CONVERSATION_SUCCESS]: 
        {
            loading:false,
            error:null,
            conversations:action.payload
        },
        [constants.LIST_CONVERSATION_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.LIST_CONVERSATION_RESET]: 
        {
            loading:false,
            error:action.payload,
            conversations:null
        }
    }

    return cases[action.type] || {...state}
}

const createMessage = (state, action) => {
    const cases = {
        [constants.CREATE_MESSAGE_REQUEST]: 
        {
            loading:false,
            error:null
        },
        [constants.CREATE_MESSAGE_SUCCESS]: 
        {
            loading:false,
            error:null,
            success:action.payload
        },
        [constants.CREATE_MESSAGE_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.CREATE_MESSAGE_RESET]: 
        {
            loading:false,
            error:action.payload,
            success:null
        }
    }

    return cases[action.type] || {...state}
}

const listMessages = (state, action) => {
    const cases = {
        [constants.LIST_CONVERSATION_MESSAGES_REQUEST]: 
        {
            loading:false,
            error:null
        },
        [constants.LIST_CONVERSATION_MESSAGES_SUCCESS]: 
        {
            loading:false,
            error:null,
            messages:action.payload
        },
        [constants.LIST_CONVERSATION_MESSAGES_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.LIST_CONVERSATION_MESSAGES_RESET]: 
        {
            loading:false,
            error:action.payload,
            messages:null
        }
    }

    return cases[action.type] || {...state}
}

const searchConversations = (state, action) => {
    const cases = {
        [constants.SEARCH_CONVERSATIONS_REQUEST]: 
        {
            loading:false,
            error:null
        },
        [constants.SEARCH_CONVERSATIONS_SUCCESS]: 
        {
            loading:false,
            error:null,
            output:action.payload
        },
        [constants.SEARCH_CONVERSATIONS_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.SEARCH_CONVERSATIONS_RESET]: 
        {
            loading:false,
            error:action.payload,
            output:null
        }
    }

    return cases[action.type] || {...state}
}

const reducer = {
    createConversation,
    createRoom,
    updateRoom,
    deleteRoom,
    addMemberToRoom,
    removeMemberFromRoom,
    listConversations,
    createMessage,
    listMessages,
    searchConversations
}

export default reducer