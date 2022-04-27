import constants from '../constants'
import api from '../api'

const listNews = () => async (dispatch) => {
  dispatch({ type: constants.content.LIST_NEWS_REQUEST })
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

const createContent = (info, type) => async (dispatch, getState) => {
  dispatch({ type: constants.content.CREATE_CONTENT_REQUEST })
  try {
    const { data } = await api.content.createContent(info)
    const { news } = getState().listNews
    if (news && type === 'news') {
      const updateNews = [...news, data.content]
      dispatch({
        type: constants.content.LIST_NEWS_SUCCESS,
        payload: updateNews,
      })
    }
    dispatch({
      type: constants.content.CREATE_CONTENT_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.content.CREATE_CONTENT_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const getContent = (type) => async (dispatch) => {
  dispatch({ type: constants.content.GET_CONTENT_REQUEST })
  try {
    const { data } = await api.content.getContent(type)
    dispatch({
      type: constants.content.GET_CONTENT_SUCCESS,
      payload: data.content,
    })
  } catch (error) {
    dispatch({
      type: constants.content.GET_CONTENT_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const updateContent = (type, id, info) => async (dispatch, getState) => {
  dispatch({ type: constants.content.UPDATE_CONTENT_REQUEST })
  try {
    const { data } = await api.content.updateContent(id, info)
    const { content } = getState().getContent
    const { news } = getState().listNews

    if (content && (type === 'about' || type === 'contact')) {
      dispatch({
        type: constants.content.GET_CONTENT_SUCCESS,
        payload: data.content,
      })
    }

    if (news && type === 'news') {
      const updateNews = news.map((n) => {
        if (n._id === id) {
          return data.content
        }
        return n
      })

      dispatch({
        type: constants.content.LIST_NEWS_SUCCESS,
        payload: updateNews,
      })
    }

    dispatch({
      type: constants.content.UPDATE_CONTENT_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.content.UPDATE_CONTENT_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const deleteContent = (id) => async (dispatch, getState) => {
  dispatch({ type: constants.content.DELETE_CONTENT_REQUEST })
  try {
    const { data } = await api.content.deleteContent(id)

    const { news } = getState().listNews

    if (news) {
      const updateNews = news.filter((n) => n._id !== id)
      dispatch({
        type: constants.content.LIST_NEWS_SUCCESS,
        payload: updateNews,
      })
    }

    dispatch({
      type: constants.content.DELETE_CONTENT_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.content.DELETE_CONTENT_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const listSlider = () => async (dispatch) => {
  dispatch({ type: constants.content.LIST_SLIDERS_REQUEST })
  try {
    const { data } = await api.content.listSlider()
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

const addSlider = (info) => async (dispatch, getState) => {
  dispatch({ type: constants.content.ADD_SLIDER_REQUEST })
  try {
    console.log('info action', info)
    const { data } = await api.content.addSlider(info)
    const { sliders } = getState().listSliders
    if (sliders) {
      const updateSliders = [...sliders, data.slider]
      dispatch({
        type: constants.content.LIST_SLIDERS_SUCCESS,
        payload: updateSliders,
      })
    }
    dispatch({
      type: constants.content.ADD_SLIDER_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.content.ADD_SLIDER_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const updateSliders = (id, info) => async (dispatch, getState) => {
  dispatch({ type: constants.content.EDIT_SLIDER_REQUEST })
  try {
    const { data } = await api.content.editSlider(id, info)
    const { sliders } = getState().listSliders
    if (sliders) {
      const updateSliders = sliders.map((slider) => {
        if (slider._id === id) {
          return data.slider
        }
        return slider
      })
      dispatch({
        type: constants.content.LIST_SLIDERS_SUCCESS,
        payload: updateSliders,
      })
    }
    dispatch({
      type: constants.content.EDIT_SLIDER_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.content.EDIT_SLIDER_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const deleteSlider = (id) => async (dispatch, getState) => {
  dispatch({ type: constants.content.DELETE_SLIDER_REQUEST })
  try {
    const { data } = await api.content.deleteSlider(id)
    const { sliders } = getState().listSliders
    if (sliders) {
      const updateSliders = sliders.filter((slider) => slider._id !== id)
      dispatch({
        type: constants.content.LIST_SLIDERS_SUCCESS,
        payload: updateSliders,
      })
    }
    dispatch({
      type: constants.content.DELETE_SLIDER_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.content.DELETE_SLIDER_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const listSocial = () => async (dispatch) => {
  dispatch({ type: constants.content.LIST_SOCIAL_REQUEST })
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

const createSocial = (info) => async (dispatch, getState) => {
  dispatch({ type: constants.content.CREATE_SOCIAL_REQUEST })
  try {
    const { data } = await api.content.createSocial(info)
    const { socials } = getState().listSocials
    if (socials) {
      const updateSocials = [...socials, data.social]
      dispatch({
        type: constants.content.LIST_SOCIAL_SUCCESS,
        payload: updateSocials,
      })
    }
    dispatch({
      type: constants.content.CREATE_SOCIAL_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.content.CREATE_SOCIAL_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const deleteSocial = (id) => async (dispatch, getState) => {
  dispatch({ type: constants.content.DELETE_SOCIAL_REQUEST })
  try {
    const { data } = await api.content.deleteSocial(id)
    const { socials } = getState().listSocials
    if (socials) {
      const updateSocials = socials.filter((social) => social._id !== id)
      dispatch({
        type: constants.content.LIST_SOCIAL_SUCCESS,
        payload: updateSocials,
      })
    }
    dispatch({
      type: constants.content.DELETE_SOCIAL_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.content.DELETE_SOCIAL_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const actions = {
  listNews,
  createContent,
  getContent,
  updateContent,
  deleteContent,
  listSlider,
  addSlider,
  updateSliders,
  deleteSlider,
  listSocial,
  createSocial,
  deleteSocial,
}

export default actions
