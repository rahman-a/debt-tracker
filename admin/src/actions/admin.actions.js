import constants from '../constants'
import api from '../api'

const login = (info) => async (dispatch) => {
  dispatch({ type: constants.admin.ADMIN_LOGIN_REQUEST })

  try {
    const { data } = await api.admin.login(info)
    localStorage.setItem('staff', JSON.stringify(data.staff))
    localStorage.setItem('expiryAdAt', JSON.stringify(data.expiryAdAt))
    dispatch({
      type: constants.admin.ADMIN_LOGIN_SUCCESS,
      staff: data.staff,
      isAuth: true,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.ADMIN_LOGIN_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const logout = () => async (dispatch) => {
  dispatch({ type: constants.admin.ADMIN_LOGOUT_REQUEST })
  try {
    await api.admin.logout()
    localStorage.removeItem('staff')
    localStorage.removeItem('expiryAdAt')
    dispatch({ type: constants.admin.ADMIN_LOGOUT_SUCCESS })
    dispatch({ type: constants.admin.ADMIN_LOGIN_RESET })
  } catch (error) {
    dispatch({
      type: constants.admin.ADMIN_LOGOUT_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const sendResetLink = (email) => async (dispatch) => {
  dispatch({ type: constants.admin.SEND_RESET_LINK_REQUEST })
  try {
    const { data } = await api.admin.sendPasswordResetLink(email)
    dispatch({
      type: constants.admin.SEND_RESET_LINK_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.SEND_RESET_LINK_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const verifyAuthLink = (info) => async (dispatch) => {
  dispatch({ type: constants.admin.VERIFY_AUTH_LINK_REQUEST })
  try {
    const { data } = await api.admin.verifyAuthLink(info)
    dispatch({
      type: constants.admin.VERIFY_AUTH_LINK_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.VERIFY_AUTH_LINK_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const members = (query) => async (dispatch) => {
  dispatch({ type: constants.admin.USERS_LIST_REQUEST })
  try {
    const { data } = await api.admin.members(query)
    dispatch({
      type: constants.admin.USERS_LIST_SUCCESS,
      users: data.users,
      count: data.count,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.USERS_LIST_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const member = (id) => async (dispatch) => {
  dispatch({ type: constants.admin.USER_DATA_REQUEST })

  try {
    const { data } = await api.admin.member(id)
    dispatch({
      type: constants.admin.USER_DATA_SUCCESS,
      payload: data.user,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.USER_DATA_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const toggleUser = (id) => async (dispatch) => {
  dispatch({ type: constants.admin.USER_TOGGLE_REQUEST })

  try {
    const { data } = await api.admin.toggle(id)
    dispatch({
      type: constants.admin.USER_TOGGLE_SUCCESS,
      payload: data.isConfirmed,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.USER_TOGGLE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const userColorCode = (id, info) => async (dispatch) => {
  dispatch({ type: constants.admin.USER_COLOR_CHANGE_REQUEST })

  try {
    const { data } = await api.admin.color(id, info)
    dispatch({
      type: constants.admin.USER_COLOR_CHANGE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.USER_COLOR_CHANGE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const changeUserRole = (id, role) => async (dispatch) => {
  dispatch({ type: constants.admin.USER_ROLE_CHANGE_REQUEST })
  try {
    const { data } = await api.admin.role(id, role)
    dispatch({
      type: constants.admin.USER_ROLE_CHANGE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.USER_ROLE_CHANGE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const deleteUser = (id) => async (dispatch) => {
  dispatch({ type: constants.admin.USER_DELETE_REQUEST })

  try {
    const { data } = await api.admin.delete(id)
    dispatch({
      type: constants.admin.USER_DELETE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.USER_DELETE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const createProvider = (info) => async (dispatch) => {
  dispatch({ type: constants.admin.CREATE_PROVIDER_REQUEST })

  try {
    const { data } = await api.admin.provider(info)
    dispatch({
      type: constants.admin.CREATE_PROVIDER_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.CREATE_PROVIDER_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const appInfo = () => async (dispatch) => {
  dispatch({ type: constants.admin.APP_INFO_REQUEST })

  try {
    const { data } = await api.admin.info()
    dispatch({
      type: constants.admin.APP_INFO_SUCCESS,
      payload: data.info,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.APP_INFO_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const latestMembers = () => async (dispatch) => {
  dispatch({ type: constants.admin.MEMBERS_LATEST_REQUEST })

  try {
    const { data } = await api.admin.latest()
    dispatch({
      type: constants.admin.MEMBERS_LATEST_SUCCESS,
      payload: data.members,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.MEMBERS_LATEST_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const memberUpdate = (id, info) => async (dispatch, getState) => {
  dispatch({ type: constants.admin.MEMBERS_UPDATE_REQUEST })

  try {
    const { data } = await api.admin.update(id, info)
    console.log('action data: ', data)
    const { member } = getState().member
    if (member) {
      const updatedMember = { ...member }
      for (let key in data.user) {
        updatedMember[key] = data.user[key]
      }
      dispatch({
        type: constants.admin.USER_DATA_SUCCESS,
        payload: updatedMember,
      })
    }
    dispatch({
      type: constants.admin.MEMBERS_UPDATE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.MEMBERS_UPDATE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const latestTickets = () => async (dispatch) => {
  dispatch({ type: constants.admin.TICKETS_LATEST_REQUEST })

  try {
    const { data } = await api.admin.tickets()
    dispatch({
      type: constants.admin.TICKETS_LATEST_SUCCESS,
      payload: data.tickets,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.TICKETS_LATEST_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const latestOperations = () => async (dispatch) => {
  dispatch({ type: constants.admin.OPERATIONS_LATEST_REQUEST })

  try {
    const { data } = await api.admin.operations()
    dispatch({
      type: constants.admin.OPERATIONS_LATEST_SUCCESS,
      payload: data.operations,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.OPERATIONS_LATEST_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const latestReports = () => async (dispatch) => {
  dispatch({ type: constants.admin.REPORTS_LATEST_REQUEST })

  try {
    const { data } = await api.admin.reports()
    dispatch({
      type: constants.admin.REPORTS_LATEST_SUCCESS,
      payload: data.reports,
    })
  } catch (error) {
    dispatch({
      type: constants.admin.REPORTS_LATEST_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const actions = {
  login,
  logout,
  sendResetLink,
  verifyAuthLink,
  members,
  member,
  toggleUser,
  userColorCode,
  changeUserRole,
  createProvider,
  deleteUser,
  appInfo,
  latestMembers,
  latestTickets,
  latestOperations,
  latestReports,
  memberUpdate,
}

export default actions
