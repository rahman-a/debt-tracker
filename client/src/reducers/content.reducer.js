import constants from '../constants'

const listSliders = (state = {}, action) => {
  const cases = {
    [constants.content.LIST_SLIDERS_REQUEST]: {
      ...state,
      isLoading: true,
      error: null,
    },
    [constants.content.LIST_SLIDERS_SUCCESS]: {
      ...state,
      isLoading: false,
      error: null,
      sliders: action.payload,
    },
    [constants.content.LIST_SLIDERS_FAIL]: {
      ...state,
      isLoading: false,
      error: action.payload,
    },
    [constants.content.LIST_SLIDERS_RESET]: {
      ...state,
      isLoading: false,
      error: null,
      sliders: null,
    },
  }
  return cases[action.type] || state
}

const getAboutUs = (state = {}, action) => {
  const cases = {
    [constants.content.GET_ABOUT_US_REQUEST]: {
      ...state,
      isLoading: true,
      error: null,
    },
    [constants.content.GET_ABOUT_US_SUCCESS]: {
      ...state,
      isLoading: false,
      error: null,
      aboutUs: action.payload,
    },
    [constants.content.GET_ABOUT_US_FAIL]: {
      ...state,
      isLoading: false,
      error: action.payload,
    },
    [constants.content.GET_ABOUT_US_RESET]: {
      ...state,
      isLoading: false,
      error: null,
      aboutUs: null,
    },
  }
  return cases[action.type] || state
}

const getContactUs = (state = {}, action) => {
  const cases = {
    [constants.content.GET_CONTACT_US_REQUEST]: {
      ...state,
      isLoading: true,
      error: null,
    },
    [constants.content.GET_CONTACT_US_SUCCESS]: {
      ...state,
      isLoading: false,
      error: null,
      contactUs: action.payload,
    },
    [constants.content.GET_CONTACT_US_FAIL]: {
      ...state,
      isLoading: false,
      error: action.payload,
    },
    [constants.content.GET_CONTACT_US_RESET]: {
      ...state,
      isLoading: false,
      error: null,
      contactUs: null,
    },
  }
  return cases[action.type] || state
}

const listNews = (state = {}, action) => {
  const cases = {
    [constants.content.LIST_NEWS_REQUEST]: {
      ...state,
      isLoading: true,
      error: null,
    },
    [constants.content.LIST_NEWS_SUCCESS]: {
      ...state,
      isLoading: false,
      error: null,
      news: action.payload,
    },
    [constants.content.LIST_NEWS_FAIL]: {
      ...state,
      isLoading: false,
      error: action.payload,
    },
    [constants.content.LIST_NEWS_RESET]: {
      ...state,
      isLoading: false,
      error: null,
      news: null,
    },
  }
  return cases[action.type] || state
}

const listSocial = (state = {}, action) => {
  const cases = {
    [constants.content.LIST_SOCIAL_REQUEST]: {
      ...state,
      isLoading: true,
      error: null,
    },
    [constants.content.LIST_SOCIAL_SUCCESS]: {
      ...state,
      isLoading: false,
      error: null,
      socials: action.payload,
    },
    [constants.content.LIST_SOCIAL_FAIL]: {
      ...state,
      isLoading: false,
      error: action.payload,
    },
    [constants.content.LIST_SOCIAL_RESET]: {
      ...state,
      isLoading: false,
      error: null,
      socials: null,
    },
  }
  return cases[action.type] || state
}

const getArticleData = (state = {}, action) => {
  const cases = {
    [constants.content.GET_ARTICLE_REQUEST]: {
      ...state,
      isLoading: true,
      error: null,
    },
    [constants.content.GET_ARTICLE_SUCCESS]: {
      ...state,
      isLoading: false,
      error: null,
      article: action.payload,
    },
    [constants.content.GET_ARTICLE_FAIL]: {
      ...state,
      isLoading: false,
      error: action.payload,
    },
    [constants.content.GET_ARTICLE_RESET]: {
      ...state,
      isLoading: false,
      error: null,
      article: null,
    },
  }
  return cases[action.type] || state
}

const reducers = {
  listSliders,
  getAboutUs,
  getContactUs,
  listNews,
  getArticleData,
  listSocial,
}

export default reducers
