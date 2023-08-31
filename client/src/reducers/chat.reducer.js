import constants from '../constants'
const { chat } = constants

const searchChatUsers = (state = {}, action) => {
  const cases = {
    [chat.SEARCH_USERS_REQUEST]: {
      loading: true,
      error: null,
    },
    [chat.SEARCH_USERS_SUCCESS]: {
      loading: false,
      error: null,
      users: action.payload,
    },
    [chat.SEARCH_USERS_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [chat.SEARCH_USERS_RESET]: {
      loading: false,
      error: null,
      users: null,
    },
  }

  return cases[action.type] ?? { ...state }
}

const createNewChat = (state = {}, action) => {
  const cases = {
    [chat.CREATE_NEW_CHAT_REQUEST]: {
      loading: true,
      error: null,
    },
    [chat.CREATE_NEW_CHAT_SUCCESS]: {
      loading: false,
      error: null,
      users: action.payload,
    },
    [chat.CREATE_NEW_CHAT_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [chat.CREATE_NEW_CHAT_RESET]: {
      loading: false,
      error: null,
      users: null,
    },
  }

  return cases[action.type] ?? { ...state }
}

const chatOptions = (state = {}, action) => {
  const cases = {
    [chat.SET_PEER_ID]: {
      ...state,
      peerId: action.payload,
    },
    [chat.RESET_PEER_ID]: {
      ...state,
      peerId: null,
    },
    [chat.SET_CHAT_CLIENT]: {
      ...state,
      chatClient: action.payload,
    },
    [chat.RESET_CHAT_CLIENT]: {
      ...state,
      chatClient: null,
    },
    [chat.SET_QUERIED_CHANNEL]: {
      ...state,
      queriedChannel: action.payload,
    },
    [chat.RESET_QUERIED_CHANNEL]: {
      ...state,
      queriedChannel: null,
    },
  }

  return cases[action.type] ?? { ...state }
}

const unreadCount = (state = {}, action) => {
  const cases = {
    [chat.GET_UNREAD_COUNT]: {
      ...state,
      unreadCount: action.payload,
    },
    [chat.RESET_UNREAD_COUNT]: {
      ...state,
      unreadCount: 0,
    },
  }

  return cases[action.type] ?? { ...state }
}

const reducers = {
  searchChatUsers,
  createNewChat,
  chatOptions,
  unreadCount,
}

export default reducers
