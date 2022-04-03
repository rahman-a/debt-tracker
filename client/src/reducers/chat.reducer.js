import constants from "../constants";


const createConversation = (state, action) => {
    const cases = {
        [constants.chat.CREATE_CONVERSATION_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.chat.CREATE_CONVERSATION_SUCCESS]: 
        {
            loading:false,
            error:null,
            success:action.payload
        },
        [constants.chat.CREATE_CONVERSATION_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.chat.CREATE_CONVERSATION_RESET]: 
        {
            loading:false,
            error:action.payload,
            success:null
        }
    }

    return cases[action.type] || {...state}
}


const listConversations = (state, action) => {
    const cases = {
        [constants.chat.LIST_CONVERSATION_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.chat.LIST_CONVERSATION_SUCCESS]: 
        {
            loading:false,
            error:null,
            conversations:action.payload
        },
        [constants.chat.LIST_CONVERSATION_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.chat.LIST_CONVERSATION_RESET]: 
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
        [constants.chat.CREATE_MESSAGE_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.chat.CREATE_MESSAGE_SUCCESS]: 
        {
            loading:false,
            error:null,
            success:action.payload
        },
        [constants.chat.CREATE_MESSAGE_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.chat.CREATE_MESSAGE_RESET]: 
        {
            loading:false,
            error:action.payload,
            success:null
        }
    }

    return cases[action.type] || {...state}
}

const markMessageAsReceived = (state, action) => {
    const cases = {
        [constants.chat.MARK_MESSAGE_AS_RECEIVED_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.chat.MARK_MESSAGE_AS_RECEIVED_SUCCESS]: 
        {
            loading:false,
            error:null,
            success:action.payload
        },
        [constants.chat.MARK_MESSAGE_AS_RECEIVED_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.chat.MARK_MESSAGE_AS_RECEIVED_RESET]: 
        {
            loading:false,
            error:action.payload,
            success:null
        }
    }

    return cases[action.type] || {...state}
}

const markPeerMessagesAsReceived = (state, action) => {
    const cases = {
        [constants.chat.MARK_PEER_MESSAGES_AS_RECEIVED_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.chat.MARK_PEER_MESSAGES_AS_RECEIVED_SUCCESS]: 
        {
            loading:false,
            error:null,
            success:action.payload
        },
        [constants.chat.MARK_PEER_MESSAGES_AS_RECEIVED_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.chat.MARK_PEER_MESSAGES_AS_RECEIVED_RESET]: 
        {
            loading:false,
            error:action.payload,
            success:null
        }
    }

    return cases[action.type] || {...state}
}

const latestMessages = (state, action) => {
    const cases = {
        [constants.chat.LATEST_MESSAGES_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.chat.LATEST_MESSAGES_SUCCESS]: 
        {
            loading:false,
            error:null,
            messages:action.messages,
            count:action.count
        },
        [constants.chat.LATEST_MESSAGES_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.chat.LATEST_MESSAGES_RESET]: 
        {
            loading:false,
            error:action.payload,
            messages:null,
            count:0
        }
    }

    return cases[action.type] || {...state}
}

const listMessages = (state, action) => {
    const cases = {
        [constants.chat.LIST_CONVERSATION_MESSAGES_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.chat.LIST_CONVERSATION_MESSAGES_SUCCESS]: 
        {
            loading:false,
            error:null,
            conversation:action.payload
        },
        [constants.chat.LIST_CONVERSATION_MESSAGES_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.chat.LIST_CONVERSATION_MESSAGES_RESET]: 
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
        [constants.chat.SEARCH_CONVERSATIONS_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.chat.SEARCH_CONVERSATIONS_SUCCESS]: 
        {
            loading:false,
            error:null,
            conversations:action.payload
        },
        [constants.chat.SEARCH_CONVERSATIONS_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.chat.SEARCH_CONVERSATIONS_RESET]: 
        {
            loading:false,
            error:action.payload,
            conversations:null
        }
    }

    return cases[action.type] || {...state}
}

const membersSearch = (state, action) => {
    const cases = {
        [constants.chat.SEARCH_MEMBERS_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.chat.SEARCH_MEMBERS_SUCCESS]: 
        {
            loading:false,
            error:null,
            members:action.payload
        },
        [constants.chat.SEARCH_MEMBERS_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.chat.SEARCH_MEMBERS_RESET]: 
        {
            loading:false,
            error:action.payload,
            members:null
        }
    }

    return cases[action.type] || {...state}
}

const reducer = {
    createConversation,
    listConversations,
    createMessage,
    listMessages,
    searchConversations,
    membersSearch,
    latestMessages,
    markMessageAsReceived,
    markPeerMessagesAsReceived
}

export default reducer