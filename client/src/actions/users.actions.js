import constants from '../constants'
import api from '../api'

const checkInfo = (info) => async (dispatch) => {
  dispatch({ type: constants.users.CHECK_INFO_REQUEST })
  try {
    const { data } = await api.users.checkInfo(info)
    dispatch({
      type: constants.users.CHECK_INFO_SUCCESS,
      payload: data.success,
    })
  } catch (error) {
    dispatch({
      type: constants.users.CHECK_INFO_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const updateDocuments = (id, info, type) => async (dispatch, getState) => {
  dispatch({ type: constants.users.DOCUMENT_UPDATE_REQUEST })
  try {
    const { data } = await api.users.updateDocuments(id, info, type)
    const { user } = getState().userProfile
    console.log({ data })
    if (user) {
      const copiedUser = { ...user }

      if (type === 'passport') {
        copiedUser['passport'] = data.doc
      } else {
        copiedUser['identity-front'] = data.doc.identityFront
        copiedUser['identity-back'] = data.doc.identityBack
      }

      dispatch({
        type: constants.users.USER_PROFILE_SUCCESS,
        payload: copiedUser,
      })
    }

    dispatch({
      type: constants.users.DOCUMENT_UPDATE_SUCCESS,
      payload: data.isDone,
    })
  } catch (error) {
    dispatch({
      type: constants.users.DOCUMENT_UPDATE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const sendCodeToPhone = (email) => async (dispatch) => {
  dispatch({ type: constants.users.SEND_PHONE_CODE_REQUEST })
  try {
    const { data } = await api.users.sendVerifyCodeToPhone(email)
    dispatch({
      type: constants.users.SEND_PHONE_CODE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.users.SEND_PHONE_CODE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const verifyPhoneCode = (code, email) => async (dispatch) => {
  dispatch({ type: constants.users.VERIFY_PHONE_CODE_REQUEST })
  try {
    const { data } = await api.users.verifyPhoneCode(code, email)
    dispatch({
      type: constants.users.VERIFY_PHONE_CODE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.users.VERIFY_PHONE_CODE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const sendResetLink = (email) => async (dispatch) => {
  dispatch({ type: constants.users.SEND_RESET_LINK_REQUEST })
  try {
    const { data } = await api.users.sendPasswordResetLink(email)
    dispatch({
      type: constants.users.SEND_RESET_LINK_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.users.SEND_RESET_LINK_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const sendLoginCredentials = (info) => async (dispatch) => {
  dispatch({ type: constants.users.USER_SEND_CREDENTIALS_REQUEST })
  try {
    const { data } = await api.users.sendLoginCredentials(info)
    dispatch({
      type: constants.users.USER_SEND_CREDENTIALS_SUCCESS,
      payload: data.user,
    })
  } catch (error) {
    dispatch({
      type: constants.users.USER_SEND_CREDENTIALS_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const sendLoginCode = (id) => async (dispatch) => {
  dispatch({ type: constants.users.SEND_LOGIN_CODE_REQUEST })
  try {
    const { data } = await api.users.sendLoginCode(id)
    dispatch({
      type: constants.users.SEND_LOGIN_CODE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.users.SEND_LOGIN_CODE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const verifyLoginCode = (id, info) => async (dispatch) => {
  dispatch({ type: constants.users.VERIFY_LOGIN_CODE_REQUEST })
  try {
    const { data } = await api.users.verifyLoginCode(id, info)
    dispatch({
      type: constants.users.VERIFY_LOGIN_CODE_SUCCESS,
    })
    dispatch({
      type: constants.users.USER_IS_AUTH_SUCCESS,
      payload: data.user,
      isAuth: true,
    })
    dispatch({ type: constants.users.USER_SEND_CREDENTIALS_RESET })
  } catch (error) {
    dispatch({
      type: constants.users.VERIFY_LOGIN_CODE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const isUserAuth = () => async (dispatch) => {
  dispatch({ type: constants.users.USER_IS_AUTH_REQUEST })
  try {
    const { data } = await api.users.isLoggedIn()
    console.log('🚀isUserLoggedIn ~ data:', data)
    dispatch({
      type: constants.users.USER_IS_AUTH_SUCCESS,
      payload: data.user,
      isAuth: true,
    })
  } catch (error) {
    dispatch({
      type: constants.users.USER_IS_AUTH_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const logout = (id) => async (dispatch) => {
  dispatch({ type: constants.users.USER_LOGOUT_REQUEST })
  try {
    await api.users.logout()
    localStorage.removeItem('user')
    localStorage.removeItem('expiryAt')
    dispatch({ type: constants.users.USER_LOGOUT_SUCCESS })
    dispatch({ type: constants.users.VERIFY_LOGIN_CODE_RESET, payload: id })
  } catch (error) {
    dispatch({
      type: constants.users.USER_LOGOUT_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const updatePhoneNumber = (id, phone) => async (dispatch) => {
  dispatch({ type: constants.users.UPDATE_PHONE_REQUEST })
  try {
    const { data } = await api.users.updatePhoneNumber(id, phone)
    dispatch({
      type: constants.users.UPDATE_PHONE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.users.UPDATE_PHONE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const updatePassword = (info) => async (dispatch) => {
  dispatch({ type: constants.users.PASSWORD_UPDATE_REQUEST })
  try {
    const { data } = await api.users.updatePassword(info)
    dispatch({
      type: constants.users.PASSWORD_UPDATE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.users.PASSWORD_UPDATE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const getUserProfile = () => async (dispatch) => {
  dispatch({ type: constants.users.USER_PROFILE_REQUEST })
  try {
    const { data } = await api.users.getUserProfile()
    dispatch({ type: constants.users.USER_PROFILE_SUCCESS, payload: data.user })
  } catch (error) {
    dispatch({
      type: constants.users.USER_PROFILE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const SearchForUsers = (query) => async (dispatch) => {
  dispatch({ type: constants.users.USERS_SEARCH_REQUEST })
  try {
    const { data } = await api.users.search(query)
    dispatch({
      type: constants.users.USERS_SEARCH_SUCCESS,
      payload: data.users,
    })
  } catch (error) {
    dispatch({
      type: constants.users.USERS_SEARCH_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const updateAddressAndPhone = (info) => async (dispatch, getState) => {
  dispatch({ type: constants.users.UPDATE_PHONE_AND_ADDRESS_REQUEST })
  try {
    const { data } = await api.users.updateAddressAndPhone(info)
    const { user } = getState().userProfile
    if (user) {
      const updatedUser = { ...user }
      for (let key in data.user) {
        updatedUser[key] = data.user[key]
      }
      dispatch({
        type: constants.users.USER_PROFILE_SUCCESS,
        payload: updatedUser,
      })
    }
    dispatch({
      type: constants.users.UPDATE_PHONE_AND_ADDRESS_SUCCESS,
      payload: true,
    })
  } catch (error) {
    dispatch({
      type: constants.users.UPDATE_PHONE_AND_ADDRESS_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const sendContactEmail = (info) => async (dispatch) => {
  dispatch({ type: constants.users.SEND_CONTACT_REQUEST })
  try {
    const { data } = await api.users.sendContact(info)
    dispatch({
      type: constants.users.SEND_CONTACT_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.users.SEND_CONTACT_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const getMutualsPeers = (id, skip) => async (dispatch) => {
  dispatch({ type: constants.users.GET_MUTUALS_REQUEST })
  try {
    const { data } = await api.users.getMutuals(id, skip)
    dispatch({
      type: constants.users.GET_MUTUALS_SUCCESS,
      payload: {
        mutuals: data.mutuals,
        count: data.count,
      },
    })
  } catch (error) {
    dispatch({
      type: constants.users.GET_MUTUALS_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const actions = {
  checkInfo,
  getUserProfile,
  updatePassword,
  updateDocuments,
  isUserAuth,
  logout,
  SearchForUsers,
  updateAddressAndPhone,
  sendContactEmail,
  getMutualsPeers,
  updatePhoneNumber,
  sendCodeToPhone,
  verifyPhoneCode,
  sendResetLink,
  sendLoginCredentials,
  sendLoginCode,
  verifyLoginCode,
}

export default actions
