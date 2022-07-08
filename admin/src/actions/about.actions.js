import constants from '../constants'
import api from '../api'

const createContent = (info) => async (dispatch) => {
  dispatch({ type: constants.content.CREATE_ABOUT_REQUEST })

  try {
    const { data } = await api.about.createContent(info)
    dispatch({
      type: constants.content.CREATE_ABOUT_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: constants.content.CREATE_ABOUT_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const getAboutContent = () => async (dispatch) => {
  dispatch({ type: constants.content.GET_ABOUT_REQUEST })

  try {
    const { data } = await api.about.getContent()
    dispatch({
      type: constants.content.GET_ABOUT_SUCCESS,
      payload: data.content,
    })
  } catch (error) {
    dispatch({
      type: constants.content.GET_ABOUT_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const updateHeadline = (id, info) => async (dispatch, getState) => {
  dispatch({ type: constants.content.UPDATE_ABOUT_HEADLINE_REQUEST })

  try {
    const { data } = await api.about.updateHeadline(id, info)
    const { content } = getState().getAboutContent
    if (content) {
      dispatch({
        type: constants.content.GET_ABOUT_SUCCESS,
        payload: data.content,
      })
    }
    dispatch({
      type: constants.content.UPDATE_ABOUT_HEADLINE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.content.UPDATE_ABOUT_HEADLINE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const createAboutItem = (id, info) => async (dispatch, getState) => {
  dispatch({ type: constants.content.CREATE_ABOUT_ITEM_REQUEST })

  try {
    const { data } = await api.about.createAboutItem(id, info)
    const { content } = getState().getAboutContent
    if (content) {
      dispatch({
        type: constants.content.GET_ABOUT_SUCCESS,
        payload: data.content,
      })
    }
    dispatch({
      type: constants.content.CREATE_ABOUT_ITEM_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.content.CREATE_ABOUT_ITEM_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const updateAboutItem = (id, info) => async (dispatch, getState) => {
  dispatch({ type: constants.content.UPDATE_ABOUT_ITEM_REQUEST })

  try {
    const { data } = await api.about.updateAboutItem(id, info)
    const { content } = getState().getAboutContent
    if (content) {
      dispatch({
        type: constants.content.GET_ABOUT_SUCCESS,
        payload: data.content,
      })
    }
    dispatch({
      type: constants.content.UPDATE_ABOUT_ITEM_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.content.UPDATE_ABOUT_ITEM_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const deleteAboutItem = (id) => async (dispatch, getState) => {
  dispatch({ type: constants.content.DELETE_ABOUT_ITEM_REQUEST })

  try {
    const { data } = await api.about.deleteAboutItem(id)
    const { content } = getState().getAboutContent
    if (content) {
      const newContent = { ...content }
      const newItems = content.items.filter((item) => item._id !== id)
      newContent.items = newItems
      dispatch({
        type: constants.content.GET_ABOUT_SUCCESS,
        payload: newContent,
      })
    }
    dispatch({
      type: constants.content.DELETE_ABOUT_ITEM_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.content.DELETE_ABOUT_ITEM_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const actions = {
  createContent,
  getAboutContent,
  updateHeadline,
  createAboutItem,
  deleteAboutItem,
  updateAboutItem,
}

export default actions
