import constants from "../constants";
import api from '../api'

const login = (info) => async (dispatch) => {
    dispatch({type:constants.admin.ADMIN_LOGIN_REQUEST}) 

    try {
        const {data} = await api.admin.login(info) 
        localStorage.setItem('staff', JSON.stringify(data.staff))
        localStorage.setItem('expiryAdAt', JSON.stringify(data.expiryAdAt))
        dispatch({
            type:constants.admin.ADMIN_LOGIN_SUCCESS,
            staff:data.staff,
            isAuth:true
        })
    } catch (error) {
        dispatch({
            type:constants.admin.ADMIN_LOGIN_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const logout = () => async (dispatch) => {
    dispatch({type:constants.admin.ADMIN_LOGOUT_REQUEST}) 
    try {
        await api.admin.logout()
        localStorage.removeItem('staff')
        localStorage.removeItem('expiryAdAt')
        dispatch({type:constants.admin.ADMIN_LOGOUT_SUCCESS}) 
    } catch (error) {
        dispatch({
            type:constants.admin.ADMIN_LOGOUT_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const sendResetLink = (email) => async (dispatch) => {
    dispatch({type:constants.admin.SEND_RESET_LINK_REQUEST}) 
    try {
        const {data} = await api.admin.sendPasswordResetLink(email)
        dispatch({type: constants.admin.SEND_RESET_LINK_SUCCESS, payload: data.message})
    } catch (error) {
        dispatch({
            type:constants.admin.SEND_RESET_LINK_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const verifyAuthLink = (info) => async (dispatch) => {
    dispatch({type:constants.admin.VERIFY_AUTH_LINK_REQUEST}) 
    try {
        const {data} = await api.admin.verifyAuthLink(info)
        dispatch({type: constants.admin.VERIFY_AUTH_LINK_SUCCESS, payload: data.message})
    } catch (error) {
        dispatch({
            type:constants.admin.VERIFY_AUTH_LINK_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}


const actions = {
    login,
    logout,
    sendResetLink,
    verifyAuthLink
}

export default actions