import { toast } from 'react-toastify'
import { CustomToast } from '../components'
import constants from '../constants'
import api from '../api'

const listNotification = (query) => async (dispatch) => {
  dispatch({ type: constants.notifications.LIST_NOTIFICATIONS_REQUEST })
  try {
    const { data } = await api.notifications.index(query)
    dispatch({
      type: constants.notifications.LIST_NOTIFICATIONS_SUCCESS,
      notifications: data.notifications,
      count: data.count,
      nonRead: data.countNonRead,
    })
  } catch (error) {
    dispatch({
      type: constants.notifications.LIST_NOTIFICATIONS_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const newNotification = (info) => async (dispatch) => {
  dispatch({ type: constants.notifications.NEW_NOTIFICATION_REQUEST })

  try {
    const { data } = await api.notifications.new(info)
    dispatch({
      type: constants.notifications.NEW_NOTIFICATION_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.notifications.NEW_NOTIFICATION_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const updateNotificationState = (id) => async (dispatch, getState) => {
  dispatch({ type: constants.notifications.UPDATE_NOTIFICATION_REQUEST })

  try {
    const { data } = await api.notifications.updateState(id)

    let { notifications, count, nonRead } = getState().listNotifications

    if (notifications) {
      const copiedNotifications = JSON.parse(JSON.stringify(notifications))

      copiedNotifications.forEach((notification) => {
        if (notification._id === id) {
          notification.isRead = data.isRead
        }
      })
      dispatch({
        type: constants.notifications.LIST_NOTIFICATIONS_SUCCESS,
        notifications: copiedNotifications,
        count,
        nonRead: data.isRead ? nonRead - 1 : nonRead + 1,
      })
    }

    dispatch({
      type: constants.notifications.UPDATE_NOTIFICATION_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.notifications.UPDATE_NOTIFICATION_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const pushNotification = () => async (dispatch, getState) => {
  dispatch({ type: constants.notifications.PUSH_NOTIFICATIONS_REQUEST })

  try {
    const { data } = await api.notifications.push()

    let { notifications, nonRead, count } = getState().listNotifications
    if (!notifications?.length) {
      dispatch({
        type: constants.notifications.LIST_NOTIFICATIONS_SUCCESS,
        notifications: data.notifications,
        count: data.notifications.length,
        nonRead: data.notifications.length,
      })
    } else if (notifications && notifications.length < 7) {
      const reducedNotifications = data.notifications.slice(
        0,
        Math.abs(notifications.length - 7)
      )
      notifications = [...reducedNotifications, ...notifications]
      dispatch({
        type: constants.notifications.LIST_NOTIFICATIONS_SUCCESS,
        notifications,
        count,
        nonRead: nonRead + data.notifications.length,
      })
    }

    if (data?.notifications?.length) {
      data.notifications.forEach((notification) => {
        toast(<CustomToast />, {
          data: notification,
          style: { padding: 0 },
        })
      })
    }

    dispatch({
      type: constants.notifications.PUSH_NOTIFICATIONS_SUCCESS,
      payload: data.notifications,
    })
  } catch (error) {
    dispatch({
      type: constants.notifications.PUSH_NOTIFICATIONS_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const actions = {
  listNotification,
  newNotification,
  pushNotification,
  updateNotificationState,
}

export default actions
