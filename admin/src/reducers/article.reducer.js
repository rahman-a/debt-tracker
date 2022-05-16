import constants from '../constants'

const listArticles = (state = {}, action) => {
  const cases = {
    [constants.article.LIST_ARTICLES_REQUEST]: {
      ...state,
      isLoading: true,
      error: null,
    },
    [constants.article.LIST_ARTICLES_SUCCESS]: {
      ...state,
      isLoading: false,
      error: null,
      articles: action.articles,
      count: action.count,
    },
    [constants.article.LIST_ARTICLES_FAIL]: {
      ...state,
      isLoading: false,
      error: action.error,
    },
    [constants.article.LIST_ARTICLES_RESET]: {
      ...state,
      isLoading: false,
      error: null,
    },
  }
  return cases[action.type] || state
}

const createArticle = (state = {}, action) => {
  const cases = {
    [constants.article.CREATE_ARTICLE_REQUEST]: {
      ...state,
      isLoading: true,
      error: null,
    },
    [constants.article.CREATE_ARTICLE_SUCCESS]: {
      ...state,
      isLoading: false,
      error: null,
      message: action.message,
    },
    [constants.article.CREATE_ARTICLE_FAIL]: {
      ...state,
      isLoading: false,
      error: action.error,
    },
    [constants.article.CREATE_ARTICLE_RESET]: {
      ...state,
      isLoading: false,
      error: null,
      message: null,
    },
  }
  return cases[action.type] || state
}

const updateArticle = (state = {}, action) => {
  const cases = {
    [constants.article.UPDATE_ARTICLE_REQUEST]: {
      ...state,
      isLoading: true,
      error: null,
    },
    [constants.article.UPDATE_ARTICLE_SUCCESS]: {
      ...state,
      isLoading: false,
      error: null,
      message: action.payload,
    },
    [constants.article.UPDATE_ARTICLE_FAIL]: {
      ...state,
      isLoading: false,
      error: action.error,
    },
    [constants.article.UPDATE_ARTICLE_RESET]: {
      ...state,
      isLoading: false,
      message: null,
      error: null,
    },
  }
  return cases[action.type] || state
}

const getArticle = (state = {}, action) => {
  const cases = {
    [constants.article.GET_ARTICLE_REQUEST]: {
      ...state,
      isLoading: true,
      error: null,
    },
    [constants.article.GET_ARTICLE_SUCCESS]: {
      ...state,
      isLoading: false,
      error: null,
      article: action.article,
    },
    [constants.article.GET_ARTICLE_FAIL]: {
      ...state,
      isLoading: false,
      error: action.error,
    },
    [constants.article.GET_ARTICLE_RESET]: {
      ...state,
      isLoading: false,
      error: null,
      article: null,
    },
  }
  return cases[action.type] || state
}

const deleteArticle = (state = {}, action) => {
  const cases = {
    [constants.article.DELETE_ARTICLE_REQUEST]: {
      ...state,
      isLoading: true,
      error: null,
    },
    [constants.article.DELETE_ARTICLE_SUCCESS]: {
      ...state,
      isLoading: false,
      error: null,
      message: action.message,
    },
    [constants.article.DELETE_ARTICLE_FAIL]: {
      ...state,
      isLoading: false,
      error: action.error,
    },
    [constants.article.DELETE_ARTICLE_RESET]: {
      ...state,
      isLoading: false,
      error: null,
      message: null,
    },
  }
  return cases[action.type] || state
}

const reducers = {
  listArticles,
  createArticle,
  updateArticle,
  getArticle,
  deleteArticle,
}

export default reducers
