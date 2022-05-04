import constants from '../constants'
import api from '../api'

const listArticles = (title) => async (dispatch) => {
  dispatch({ type: constants.article.LIST_ARTICLES_REQUEST })
  try {
    const { data } = await api.article.listArticles(title)
    dispatch({
      type: constants.article.LIST_ARTICLES_SUCCESS,
      articles: data.articles,
    })
  } catch (error) {
    dispatch({
      type: constants.article.LIST_ARTICLES_FAIL,
      error: error.response && error.response.data.message,
    })
  }
}

const getArticle = (id) => async (dispatch) => {
  dispatch({ type: constants.article.GET_ARTICLE_REQUEST })
  try {
    const { data } = await api.article.getArticle(id)
    dispatch({
      type: constants.article.GET_ARTICLE_SUCCESS,
      article: data.article,
    })
  } catch (error) {
    dispatch({
      type: constants.article.GET_ARTICLE_FAIL,
      error: error.response && error.response.data.message,
    })
  }
}

const createArticle = (article) => async (dispatch, getState) => {
  dispatch({ type: constants.article.CREATE_ARTICLE_REQUEST })
  try {
    const { data } = await api.article.createArticle(article)
    const { articles, count } = getState().listArticles
    if (articles) {
      const newArticles = [data.article, ...articles]
      dispatch({
        type: constants.article.LIST_ARTICLES_SUCCESS,
        articles: newArticles,
        count: count + 1,
      })
    }
    dispatch({
      type: constants.article.CREATE_ARTICLE_SUCCESS,
      message: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.article.CREATE_ARTICLE_FAIL,
      error: error.response && error.response.data.message,
    })
  }
}

const updateArticle = (id, article) => async (dispatch, getState) => {
  dispatch({ type: constants.article.UPDATE_ARTICLE_REQUEST })
  try {
    const { data } = await api.article.updateArticle(id, article)
    dispatch({
      type: constants.article.GET_ARTICLE_SUCCESS,
      article: data.article,
    })
    dispatch({
      type: constants.article.UPDATE_ARTICLE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.article.UPDATE_ARTICLE_FAIL,
      error: error.response && error.response.data.message,
    })
  }
}

const deleteArticle = (id) => async (dispatch, getState) => {
  dispatch({ type: constants.article.DELETE_ARTICLE_REQUEST })
  try {
    const { data } = await api.article.deleteArticle(id)
    const { articles, count } = getState().listArticles
    if (articles) {
      const newArticles = articles.filter((article) => article._id !== id)
      dispatch({
        type: constants.article.LIST_ARTICLES_SUCCESS,
        articles: newArticles,
        count: count - 1,
      })
    }
    dispatch({
      type: constants.article.DELETE_ARTICLE_SUCCESS,
      message: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.article.DELETE_ARTICLE_FAIL,
      error: error.response && error.response.data.message,
    })
  }
}

const actions = {
  listArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
}

export default actions
