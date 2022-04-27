import constants from '../constants/'

const listNews = (state, actions) => {
  const cases = {
    [constants.content.LIST_NEWS_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.LIST_NEWS_SUCCESS]: {
      ...state,
      loading: false,
      news: actions.payload,
    },
    [constants.content.LIST_NEWS_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.LIST_NEWS_RESET]: {
      ...state,
      loading: false,
      error: null,
      news: null,
    },
  }

  return cases[actions.type] || { ...state }
}

const createContent = (state, actions) => {
  const cases = {
    [constants.content.CREATE_CONTENT_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.CREATE_CONTENT_SUCCESS]: {
      ...state,
      loading: false,
      message: actions.payload,
    },
    [constants.content.CREATE_CONTENT_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.CREATE_CONTENT_RESET]: {
      ...state,
      loading: false,
      error: null,
      message: null,
    },
  }
  return cases[actions.type] || { ...state }
}

const updateContent = (state, actions) => {
  const cases = {
    [constants.content.UPDATE_CONTENT_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.UPDATE_CONTENT_SUCCESS]: {
      ...state,
      loading: false,
      message: actions.payload,
    },
    [constants.content.UPDATE_CONTENT_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.UPDATE_CONTENT_RESET]: {
      ...state,
      loading: false,
      error: null,
      message: null,
    },
  }
  return cases[actions.type] || { ...state }
}

const getContent = (state, actions) => {
  const cases = {
    [constants.content.GET_CONTENT_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.GET_CONTENT_SUCCESS]: {
      ...state,
      loading: false,
      content: actions.payload,
    },
    [constants.content.GET_CONTENT_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.GET_CONTENT_RESET]: {
      ...state,
      loading: false,
      error: null,
      content: null,
    },
  }
  return cases[actions.type] || { ...state }
}

const deleteContent = (state, actions) => {
  const cases = {
    [constants.content.DELETE_CONTENT_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.DELETE_CONTENT_SUCCESS]: {
      ...state,
      loading: false,
      message: actions.payload,
    },
    [constants.content.DELETE_CONTENT_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.DELETE_CONTENT_RESET]: {
      ...state,
      loading: false,
      error: null,
      message: null,
    },
  }
  return cases[actions.type] || { ...state }
}

const listSliders = (state, actions) => {
  const cases = {
    [constants.content.LIST_SLIDERS_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.LIST_SLIDERS_SUCCESS]: {
      ...state,
      loading: false,
      sliders: actions.payload,
    },
    [constants.content.LIST_SLIDERS_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.LIST_SLIDERS_RESET]: {
      ...state,
      loading: false,
      error: null,
      slider: null,
    },
  }

  return cases[actions.type] || { ...state }
}

const addSlider = (state, actions) => {
  const cases = {
    [constants.content.ADD_SLIDER_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.ADD_SLIDER_SUCCESS]: {
      ...state,
      loading: false,
      message: actions.payload,
    },
    [constants.content.ADD_SLIDER_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.ADD_SLIDER_RESET]: {
      ...state,
      loading: false,
      error: null,
      message: null,
    },
  }
  return cases[actions.type] || { ...state }
}

const editSlider = (state, actions) => {
  const cases = {
    [constants.content.EDIT_SLIDER_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.EDIT_SLIDER_SUCCESS]: {
      ...state,
      loading: false,
      message: actions.payload,
    },
    [constants.content.EDIT_SLIDER_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.EDIT_SLIDER_RESET]: {
      ...state,
      loading: false,
      error: null,
      message: null,
    },
  }
  return cases[actions.type] || { ...state }
}

const deleteSlider = (state, actions) => {
  const cases = {
    [constants.content.DELETE_SLIDER_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.DELETE_SLIDER_SUCCESS]: {
      ...state,
      loading: false,
      message: actions.payload,
    },
    [constants.content.DELETE_SLIDER_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.DELETE_SLIDER_RESET]: {
      ...state,
      loading: false,
      error: null,
      message: null,
    },
  }
  return cases[actions.type] || { ...state }
}

const listSocials = (state, actions) => {
  const cases = {
    [constants.content.LIST_SOCIAL_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.LIST_SOCIAL_SUCCESS]: {
      ...state,
      loading: false,
      socials: actions.payload,
    },
    [constants.content.LIST_SOCIAL_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.LIST_SOCIAL_RESET]: {
      ...state,
      loading: false,
      error: null,
      socials: null,
    },
  }
  return cases[actions.type] || { ...state }
}

const createSocial = (state, actions) => {
  const cases = {
    [constants.content.CREATE_SOCIAL_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.CREATE_SOCIAL_SUCCESS]: {
      ...state,
      loading: false,
      message: actions.payload,
    },
    [constants.content.CREATE_SOCIAL_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.CREATE_SOCIAL_RESET]: {
      ...state,
      loading: false,
      error: null,
      message: null,
    },
  }
  return cases[actions.type] || { ...state }
}

const deleteSocial = (state, actions) => {
  const cases = {
    [constants.content.DELETE_SOCIAL_REQUEST]: {
      ...state,
      loading: true,
      error: null,
    },
    [constants.content.DELETE_SOCIAL_SUCCESS]: {
      ...state,
      loading: false,
      message: actions.payload,
    },
    [constants.content.DELETE_SOCIAL_FAIL]: {
      ...state,
      loading: false,
      error: actions.payload,
    },
    [constants.content.DELETE_SOCIAL_RESET]: {
      ...state,
      loading: false,
      error: null,
      message: null,
    },
  }
  return cases[actions.type] || { ...state }
}

const reducers = {
  listNews,
  createContent,
  updateContent,
  deleteContent,
  getContent,
  listSliders,
  addSlider,
  editSlider,
  deleteSlider,
  createSocial,
  deleteSocial,
  listSocials,
}

export default reducers
