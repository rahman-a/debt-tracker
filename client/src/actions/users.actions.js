import constants from "../constants";
import api from '../api'


const registerCredential = (info) => async (dispatch) => {
    dispatch({type:constants.users.REGISTER_CREDENTIAL_REQUEST}) 
    try {
        const {data} = await api.users.registerCredential(info)
        localStorage.setItem('uid', data.user)
        dispatch({type: constants.users.REGISTER_CREDENTIAL_SUCCESS, payload: data.user})
    } catch (error) {
        dispatch({
            type:constants.users.REGISTER_CREDENTIAL_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const registerInfo = (id, info) => async (dispatch) => {
    dispatch({type:constants.users.REGISTER_INFO_REQUEST}) 
    try {
        const {data} = await api.users.registerInfo(id, info)
        dispatch({type: constants.users.REGISTER_INFO_SUCCESS, payload: data.isDone})
    } catch (error) {
        dispatch({
            type:constants.users.REGISTER_INFO_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const registerDocuments = (id, info) => async (dispatch) => {
    dispatch({type:constants.users.REGISTER_DOCUMENTS_REQUEST}) 
    try {
        const {data} = await api.users.registerDocuments(id, info)
        dispatch({type: constants.users.REGISTER_DOCUMENTS_SUCCESS, payload: data.isDone})
    } catch (error) {
        dispatch({
            type:constants.users.REGISTER_DOCUMENTS_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const updateDocuments = (id, info) => async (dispatch, getState) => {
    dispatch({type:constants.users.DOCUMENT_UPDATE_REQUEST})
    try {
        const {data} = await api.users.registerDocuments(id, info)
        let {userProfile:{user}} = getState()
        user = {...user, [data.type]:data.doc}
        dispatch({type: constants.users.USER_PROFILE_SUCCESS, payload:user})
        dispatch({type: constants.users.DOCUMENT_UPDATE_SUCCESS, payload: data.isDone})
    } catch (error) {
        dispatch({
            type:constants.users.DOCUMENT_UPDATE_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const sendCodeToPhone = (id, email) => async (dispatch) => {
    dispatch({type:constants.users.SEND_PHONE_CODE_REQUEST}) 
    try {
        const {data} = !id && email
        ? await api.users.sendVerifyCodeToPhone(undefined, email)
        : await api.users.sendVerifyCodeToPhone(id)
        dispatch({type: constants.users.SEND_PHONE_CODE_SUCCESS, payload: data.message})
    } catch (error) {
        dispatch({
            type:constants.users.SEND_PHONE_CODE_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const sendEmailLink = (id) => async (dispatch) => {
    dispatch({type:constants.users.SEND_EMAIL_LINK_REQUEST}) 
    try {
        const {data} = await api.users.sendVerifyEmailLink(id)
        dispatch({type: constants.users.SEND_EMAIL_LINK_SUCCESS, payload: data.message})
    } catch (error) {
        dispatch({
            type:constants.users.SEND_EMAIL_LINK_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const sendResetLink = (email) => async (dispatch) => {
    dispatch({type:constants.users.SEND_RESET_LINK_REQUEST}) 
    try {
        const {data} = await api.users.sendPasswordResetLink(email)
        dispatch({type: constants.users.SEND_RESET_LINK_SUCCESS, payload: data.message})
    } catch (error) {
        dispatch({
            type:constants.users.SEND_RESET_LINK_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}


const verifyPhoneCode = (id, code, email) => async (dispatch) => {
    
    dispatch({type:constants.users.VERIFY_PHONE_CODE_REQUEST}) 
    try {
        const {data} = !id && email
        ? await api.users.verifyPhoneCode(undefined, code, email)
        : await api.users.verifyPhoneCode(id, code)
        localStorage.removeItem('uid')
        localStorage.removeItem('isInfo')
        dispatch({type: constants.users.VERIFY_PHONE_CODE_SUCCESS, payload: data.message})
    } catch (error) {
        dispatch({
            type:constants.users.VERIFY_PHONE_CODE_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const verifyAuthLink = (info) => async (dispatch) => {
    dispatch({type:constants.users.VERIFY_AUTH_LINK_REQUEST}) 
    try {
        const {data} = await api.users.verifyAuthLink(info)
        dispatch({type: constants.users.VERIFY_AUTH_LINK_SUCCESS, payload: data.message})
    } catch (error) {
        dispatch({
            type:constants.users.VERIFY_AUTH_LINK_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const LoginInit = (info) => async (dispatch) => {
    dispatch({type:constants.users.USER_LOGIN_REQUEST}) 
    try {
        const {data} = await api.users.loginInit(info)
        dispatch({type: constants.users.USER_LOGIN_SUCCESS, payload: data.user})
    } catch (error) {
        dispatch({
            type:constants.users.USER_LOGIN_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const sendLoginCode = (id) => async (dispatch) => {
    dispatch({type:constants.users.SEND_LOGIN_CODE_REQUEST}) 
    try {
        const {data} = await api.users.sendLoginCode(id)
        dispatch({type: constants.users.SEND_LOGIN_CODE_SUCCESS, payload: data.message})
    } catch (error) {
        dispatch({
            type:constants.users.SEND_LOGIN_CODE_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const login = (id, info) => async (dispatch) => {
    dispatch({type:constants.users.VERIFY_LOGIN_CODE_REQUEST}) 
    try {
        const {data} = await api.users.login(id, info)
        localStorage.setItem('user',  JSON.stringify(data.user))
        localStorage.setItem('expiryAt', data.expiryAt)
        dispatch({type: constants.users.VERIFY_LOGIN_CODE_SUCCESS, payload: data.user, isAuth:true})
        dispatch({type:constants.users.USER_LOGIN_RESET}) 
    } catch (error) {
        dispatch({
            type:constants.users.VERIFY_LOGIN_CODE_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const logout = () => async (dispatch) => {
    dispatch({type:constants.users.USER_LOGOUT_REQUEST}) 
    try {
        await api.users.logout()
        localStorage.removeItem('user')
        localStorage.removeItem('expiryAt')
        dispatch({type:constants.users.USER_LOGOUT_SUCCESS}) 
        dispatch({type: constants.users.VERIFY_LOGIN_CODE_RESET})
    } catch (error) {
        dispatch({
            type:constants.users.USER_LOGOUT_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const updatePassword = (info) => async (dispatch) => {
    dispatch({type:constants.users.PASSWORD_UPDATE_REQUEST}) 
    try {
        const {data} = await api.users.updatePassword(info)
        dispatch({type: constants.users.PASSWORD_UPDATE_SUCCESS, payload: data.message})
    } catch (error) {
        dispatch({
            type:constants.users.PASSWORD_UPDATE_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const getUserProfile = () => async (dispatch) => {
    dispatch({type:constants.users.USER_PROFILE_REQUEST}) 
    try {
        const {data} = await api.users.getUserProfile()
        dispatch({type: constants.users.USER_PROFILE_SUCCESS, payload: data.user})
    } catch (error) {
        dispatch({
            type:constants.users.USER_PROFILE_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const actions = {
    registerCredential,
    registerInfo,
    registerDocuments,
    sendCodeToPhone,
    sendEmailLink,
    sendResetLink,
    verifyPhoneCode,
    verifyAuthLink,
    getUserProfile,
    LoginInit,
    sendLoginCode,
    updatePassword,
    updateDocuments,
    login,
    logout
}

export default actions