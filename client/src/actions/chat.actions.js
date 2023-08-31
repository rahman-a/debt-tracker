import constants from '../constants'
import api from '../api'
const { chat } = constants

const searchUsers = (name) => async (dispatch) => {
  dispatch({ type: chat.SEARCH_USERS_REQUEST })
  try {
    const { data } = await api.chat.searchUser(name)
    dispatch({
      type: chat.SEARCH_USERS_SUCCESS,
      payload: data.users,
    })
  } catch (error) {
    dispatch({
      type: chat.SEARCH_USERS_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const createNewChat = (name) => async (dispatch) => {
  dispatch({ type: chat.CREATE_NEW_CHAT_REQUEST })
  try {
    const { data } = await api.chat.searchUser(name)
    dispatch({
      type: chat.CREATE_NEW_CHAT_SUCCESS,
      payload: data.users,
    })
  } catch (error) {
    dispatch({
      type: chat.CREATE_NEW_CHAT_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const actions = {
  searchUsers,
  createNewChat,
}

export default actions
