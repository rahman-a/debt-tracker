import constants from '../constants'

const registerUser = (state, action) => {
  const cases = {
    [constants.users.REGISTER_USER_REQUEST]: { loading: true, error: null },

    [constants.users.REGISTER_USER_SUCCESS]: {
      loading: false,
      error: null,
      success: action.payload?.success,
      userId: action.payload?.id,
      phone: action.payload?.phone,
    },

    [constants.users.REGISTER_USER_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.REGISTER_USER_RESET]: {
      loading: false,
      error: null,
      success: false,
      userId: null,
      phone: null,
    },
  }

  return cases[action.type] || { ...state }
}

const checkInfo = (state, action) => {
  const cases = {
    [constants.users.CHECK_INFO_REQUEST]: { loading: true, error: null },

    [constants.users.CHECK_INFO_SUCCESS]: {
      loading: false,
      error: null,
      success: action.payload,
    },

    [constants.users.CHECK_INFO_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.CHECK_INFO_RESET]: {
      loading: false,
      error: null,
      success: false,
    },
  }

  return cases[action.type] || { ...state }
}

const updateDocuments = (state, action) => {
  const cases = {
    [constants.users.DOCUMENT_UPDATE_REQUEST]: { loading: true, error: null },

    [constants.users.DOCUMENT_UPDATE_SUCCESS]: {
      loading: false,
      error: null,
      isDone: action.payload,
    },

    [constants.users.DOCUMENT_UPDATE_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.DOCUMENT_UPDATE_RESET]: {
      loading: false,
      error: null,
      isDone: null,
    },
  }

  return cases[action.type] || { ...state }
}

const sendPhoneCode = (state, action) => {
  const cases = {
    [constants.users.SEND_PHONE_CODE_REQUEST]: { loading: true, error: null },

    [constants.users.SEND_PHONE_CODE_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },

    [constants.users.SEND_PHONE_CODE_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.SEND_PHONE_CODE_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const sendEmailLink = (state, action) => {
  const cases = {
    [constants.users.SEND_EMAIL_LINK_REQUEST]: { loading: true, error: null },

    [constants.users.SEND_EMAIL_LINK_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },

    [constants.users.SEND_EMAIL_LINK_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.SEND_EMAIL_LINK_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const sendResetLink = (state, action) => {
  const cases = {
    [constants.users.SEND_RESET_LINK_REQUEST]: { loading: true, error: null },

    [constants.users.SEND_RESET_LINK_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },

    [constants.users.SEND_RESET_LINK_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.SEND_RESET_LINK_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const VerifyPhoneCode = (state, action) => {
  const cases = {
    [constants.users.VERIFY_PHONE_CODE_REQUEST]: { loading: true, error: null },

    [constants.users.VERIFY_PHONE_CODE_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },

    [constants.users.VERIFY_PHONE_CODE_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.VERIFY_PHONE_CODE_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const updatePhoneNumber = (state, action) => {
  const cases = {
    [constants.users.UPDATE_PHONE_REQUEST]: { loading: true, error: null },

    [constants.users.UPDATE_PHONE_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },

    [constants.users.UPDATE_PHONE_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.UPDATE_PHONE_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const VerifyAuthLink = (state, action) => {
  const cases = {
    [constants.users.VERIFY_AUTH_LINK_REQUEST]: { loading: true, error: null },

    [constants.users.VERIFY_AUTH_LINK_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },

    [constants.users.VERIFY_AUTH_LINK_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.VERIFY_AUTH_LINK_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const loginInit = (state, action) => {
  const cases = {
    [constants.users.USER_LOGIN_REQUEST]: { loading: true, error: null },

    [constants.users.USER_LOGIN_SUCCESS]: {
      loading: false,
      error: null,
      userId: action.payload,
    },

    [constants.users.USER_LOGIN_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.USER_LOGIN_RESET]: {
      loading: false,
      error: null,
      userId: null,
    },
  }

  return cases[action.type] || { ...state }
}

const sendLoginCode = (state, action) => {
  const cases = {
    [constants.users.SEND_LOGIN_CODE_REQUEST]: { loading: true, error: null },

    [constants.users.SEND_LOGIN_CODE_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },

    [constants.users.SEND_LOGIN_CODE_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.SEND_LOGIN_CODE_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const login = (state, action) => {
  const cases = {
    [constants.users.VERIFY_LOGIN_CODE_REQUEST]: { loading: true, error: null },

    [constants.users.VERIFY_LOGIN_CODE_SUCCESS]: {
      loading: false,
      error: null,
      user: action.payload,
      isAuth: true,
    },

    [constants.users.VERIFY_LOGIN_CODE_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.VERIFY_LOGIN_CODE_RESET]: {
      loading: false,
      error: null,
      user: action.payload ? action.payload : null,
      isAuth: false,
    },
  }

  return cases[action.type] || { ...state }
}

const userProfile = (state, action) => {
  const cases = {
    [constants.users.USER_PROFILE_REQUEST]: { loading: true, error: null },

    [constants.users.USER_PROFILE_SUCCESS]: {
      loading: false,
      error: null,
      user: action.payload,
    },

    [constants.users.USER_PROFILE_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.USER_PROFILE_RESET]: {
      loading: false,
      error: null,
      user: null,
    },
  }

  return cases[action.type] || { ...state }
}

const updatePassword = (state, action) => {
  const cases = {
    [constants.users.PASSWORD_UPDATE_REQUEST]: {
      loading: true,
      error: null,
    },

    [constants.users.PASSWORD_UPDATE_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },

    [constants.users.PASSWORD_UPDATE_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.PASSWORD_UPDATE_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const logout = (state, action) => {
  const cases = {
    [constants.users.USER_LOGOUT_REQUEST]: {
      loading: true,
      error: null,
    },

    [constants.users.USER_LOGOUT_SUCCESS]: {
      loading: false,
      error: null,
      isLogout: true,
    },

    [constants.users.USER_LOGOUT_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.USER_LOGOUT_RESET]: {
      loading: false,
      error: null,
      isLogout: false,
    },
  }

  return cases[action.type] || { ...state }
}

const searchUsers = (state, action) => {
  const cases = {
    [constants.users.USERS_SEARCH_REQUEST]: {
      loading: true,
      error: null,
    },

    [constants.users.USERS_SEARCH_SUCCESS]: {
      loading: false,
      error: null,
      users: action.payload,
    },

    [constants.users.USERS_SEARCH_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.USERS_SEARCH_RESET]: {
      loading: false,
      error: null,
      users: false,
    },
  }

  return cases[action.type] || { ...state }
}

const updateAddressAndPhone = (state, action) => {
  const cases = {
    [constants.users.UPDATE_PHONE_AND_ADDRESS_REQUEST]: {
      loading: true,
      error: null,
    },

    [constants.users.UPDATE_PHONE_AND_ADDRESS_SUCCESS]: {
      loading: false,
      error: null,
      isDone: action.payload,
    },

    [constants.users.UPDATE_PHONE_AND_ADDRESS_FAIL]: {
      loading: false,
      error: action.payload,
    },

    [constants.users.UPDATE_PHONE_AND_ADDRESS_RESET]: {
      loading: false,
      error: null,
      isDone: null,
    },
  }

  return cases[action.type] || { ...state }
}

const sendContactEmail = (state, action) => {
  const cases = {
    [constants.users.SEND_CONTACT_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.users.SEND_CONTACT_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },
    [constants.users.SEND_CONTACT_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.users.SEND_CONTACT_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const reducers = {
  checkInfo,
  registerUser,
  sendPhoneCode,
  sendEmailLink,
  sendResetLink,
  VerifyPhoneCode,
  VerifyAuthLink,
  userProfile,
  loginInit,
  sendLoginCode,
  updatePassword,
  updateDocuments,
  login,
  logout,
  searchUsers,
  updateAddressAndPhone,
  sendContactEmail,
  updatePhoneNumber,
}

export default reducers
