import constants from '../constants'
import api from '../api'

const listSliders = () => async (dispatch) => {
  dispatch({
    type: constants.content.LIST_SLIDERS_REQUEST,
  })
  try {
    const { data } = await api.content.listSliders()
    dispatch({
      type: constants.content.LIST_SLIDERS_SUCCESS,
      payload: data.sliders,
    })
  } catch (error) {
    dispatch({
      type: constants.content.LIST_SLIDERS_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const getAboutUs = () => async (dispatch) => {
  dispatch({
    type: constants.content.GET_ABOUT_US_REQUEST,
  })
  try {
    const { data } = await api.content.getAboutUs()
    dispatch({
      type: constants.content.GET_ABOUT_US_SUCCESS,
      payload: data.content,
    })
  } catch (error) {
    dispatch({
      type: constants.content.GET_ABOUT_US_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const getContactUs = () => async (dispatch) => {
  dispatch({
    type: constants.content.GET_CONTACT_US_REQUEST,
  })
  try {
    const { data } = await api.content.getContactUs()
    dispatch({
      type: constants.content.GET_CONTACT_US_SUCCESS,
      payload: data.content,
    })
  } catch (error) {
    dispatch({
      type: constants.content.GET_CONTACT_US_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const listNews = () => async (dispatch) => {
  dispatch({
    type: constants.content.LIST_NEWS_REQUEST,
  })
  try {
    const { data } = await api.content.listNews()
    dispatch({
      type: constants.content.LIST_NEWS_SUCCESS,
      payload: data.news,
    })
  } catch (error) {
    dispatch({
      type: constants.content.LIST_NEWS_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const listVideo = () => async (dispatch) => {
  dispatch({
    type: constants.content.LIST_VIDEO_REQUEST,
  })
  try {
    const { data } = await api.content.getVideo()
    dispatch({
      type: constants.content.LIST_VIDEO_SUCCESS,
      payload: data.content,
    })
  } catch (error) {
    dispatch({
      type: constants.content.LIST_VIDEO_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const getArticleData = (id) => async (dispatch) => {
  dispatch({
    type: constants.content.GET_ARTICLE_REQUEST,
  })
  try {
    const { data } = await api.content.getArticle(id)
    dispatch({
      type: constants.content.GET_ARTICLE_SUCCESS,
      payload: data.article,
    })
  } catch (error) {
    dispatch({
      type: constants.content.GET_ARTICLE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const listSocial = () => async (dispatch) => {
  dispatch({
    type: constants.content.LIST_SOCIAL_REQUEST,
  })
  try {
    const { data } = await api.content.listSocial()
    dispatch({
      type: constants.content.LIST_SOCIAL_SUCCESS,
      payload: data.socials,
    })
  } catch (error) {
    dispatch({
      type: constants.content.LIST_SOCIAL_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

export const increaseViews = async (id) => {
  try {
    await api.content.increaseViews(id)
  } catch (error) {
    console.log(error)
  }
}

const actions = {
  listSliders,
  getAboutUs,
  getContactUs,
  listNews,
  listVideo,
  getArticleData,
  listSocial,
}
export default actions
