import constants from "../constants";

const listNotifications = (state, action) => {
    const cases = {
        [constants.notifications.LIST_NOTIFICATIONS_REQUEST]: 
        {
            loading:true,
            error:null,
        },
        [constants.notifications.LIST_NOTIFICATIONS_SUCCESS]: 
        {
            loading:false, 
            error:null,
            notifications:action.notifications,
            count:action.count,
            nonRead:action.nonRead
        },
        [constants.notifications.LIST_NOTIFICATIONS_FAIL]: 
        {
            loading:false,
            error:action.payload,
        },
        [constants.notifications.LIST_NOTIFICATIONS_RESET]: 
        {
            loading:false,
            error:null,
            count:0,
            notifications:null
        }
    }

    return cases[action.type] || {...state}
}

const newNotification = (state, action) => {
    const cases = {
        [constants.notifications.NEW_NOTIFICATION_REQUEST]: 
        {
            loading:true,
            error:null 
        },
        [constants.notifications.NEW_NOTIFICATION_SUCCESS]: 
        {
            loading:false, 
            error:null,
            message:action.payload 
        },
        [constants.notifications.NEW_NOTIFICATION_FAIL]: 
        {
            loading:false,
            error:action.payload,
        },
        [constants.notifications.NEW_NOTIFICATION_RESET]: 
        {
            loading:false,
            error:null,
            message:null
        }
    }

    return cases[action.type] || {...state}
}

const updateNotification = (state, action) => {
    const cases = {
        [constants.notifications.UPDATE_NOTIFICATION_REQUEST]: 
        {
            loading:true,
            error:null 
        },
        [constants.notifications.UPDATE_NOTIFICATION_SUCCESS]: 
        {
            loading:false, 
            error:null,
            isUpdated:true,
            message:action.payload 
        },
        [constants.notifications.UPDATE_NOTIFICATION_FAIL]: 
        {
            loading:false,
            error:action.payload,
        },
        [constants.notifications.UPDATE_NOTIFICATION_RESET]: 
        {
            loading:false,
            error:null,
            isUpdated:false,
            message:null
        }
    }

    return cases[action.type] || {...state}
}

const pushNotifications = (state, action) => {
    const cases = {
        [constants.notifications.PUSH_NOTIFICATIONS_REQUEST]: 
        {
            loading:true,
            error:null,
        },
        [constants.notifications.PUSH_NOTIFICATIONS_SUCCESS]: 
        {
            loading:false, 
            error:null,
            notifications:action.payload,
        },
        [constants.notifications.PUSH_NOTIFICATIONS_FAIL]: 
        {
            loading:false,
            error:action.payload,
        },
        [constants.notifications.PUSH_NOTIFICATIONS_RESET]: 
        {
            loading:false,
            error:null,
            notifications:null
        }
    }

    return cases[action.type] || {...state}
}

const reducer = {
    listNotifications,
    newNotification,
    pushNotifications,
    updateNotification
}

export default reducer