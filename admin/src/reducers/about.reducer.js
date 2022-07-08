import constants from '../constants'

const createHeadline = (state, actions) => {
  const cases = {
    [constants.content.CREATE_ABOUT_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.CREATE_ABOUT_SUCCESS]: {
      ...state,
      loading: false,
      message: actions.payload?.message,
      content: actions.payload?.content,
    },
    [constants.content.CREATE_ABOUT_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.CREATE_ABOUT_RESET]: {
      ...state,
      loading: false,
      error: null,
      message: null,
      content: null,
    },
  }

  return cases[actions.type] || { ...state }
}

const getAboutContent = (state, actions) => {
  const cases = {
    [constants.content.GET_ABOUT_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.GET_ABOUT_SUCCESS]: {
      ...state,
      loading: false,
      content: actions.payload,
    },
    [constants.content.GET_ABOUT_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.GET_ABOUT_RESET]: {
      ...state,
      loading: false,
      error: null,
      content: null,
    },
  }

  return cases[actions.type] || { ...state }
}

const updateHeadline = (state, actions) => {
  const cases = {
    [constants.content.UPDATE_ABOUT_HEADLINE_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.UPDATE_ABOUT_HEADLINE_SUCCESS]: {
      ...state,
      loading: false,
      message: actions.payload,
    },
    [constants.content.UPDATE_ABOUT_HEADLINE_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.UPDATE_ABOUT_HEADLINE_RESET]: {
      ...state,
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[actions.type] || { ...state }
}

const createAboutItem = (state, actions) => {
  const cases = {
    [constants.content.CREATE_ABOUT_ITEM_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.CREATE_ABOUT_ITEM_SUCCESS]: {
      ...state,
      loading: false,
      message: actions.payload,
    },
    [constants.content.CREATE_ABOUT_ITEM_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.CREATE_ABOUT_ITEM_RESET]: {
      ...state,
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[actions.type] || { ...state }
}

const updateAboutItem = (state, actions) => {
  const cases = {
    [constants.content.UPDATE_ABOUT_ITEM_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.UPDATE_ABOUT_ITEM_SUCCESS]: {
      ...state,
      loading: false,
      message: actions.payload,
    },
    [constants.content.UPDATE_ABOUT_ITEM_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.UPDATE_ABOUT_ITEM_RESET]: {
      ...state,
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[actions.type] || { ...state }
}

const deleteAboutItem = (state, actions) => {
  const cases = {
    [constants.content.DELETE_ABOUT_ITEM_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.DELETE_ABOUT_ITEM_SUCCESS]: {
      ...state,
      loading: false,
      message: actions.payload,
    },
    [constants.content.DELETE_ABOUT_ITEM_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.DELETE_ABOUT_ITEM_RESET]: {
      ...state,
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[actions.type] || { ...state }
}

const reducers = {
  createHeadline,
  getAboutContent,
  updateHeadline,
  createAboutItem,
  deleteAboutItem,
  updateAboutItem,
}

export default reducers
