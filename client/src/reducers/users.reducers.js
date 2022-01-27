import constants from "../constants";

const registerCredential = (state, action) => {
    const cases = {

        [constants.users.REGISTER_CREDENTIAL_REQUEST]
        : {loading:true, error:null},

        [constants.users.REGISTER_CREDENTIAL_SUCCESS]
        : {loading:false, error:null, userId:action.payload},

        [constants.users.REGISTER_CREDENTIAL_FAIL]
        : {loading:false, error:action.payload},

        [constants.users.REGISTER_CREDENTIAL_RESET] 
        : {loading:false, error:null, userId:null}
    }

    return cases[action.type] || {...state}
}

const registerInfo = (state, action) => {
    const cases = {

        [constants.users.REGISTER_INFO_REQUEST]
        : {loading:true, error:null},

        [constants.users.REGISTER_INFO_SUCCESS]
        : {loading:false, error:null, isDone:action.payload},

        [constants.users.REGISTER_INFO_FAIL]
        : {loading:false, error:action.payload},

        [constants.users.REGISTER_INFO_RESET] 
        : {loading:false, error:null, isDone:null}
    }

    return cases[action.type] || {...state}
}

const registerDocuments = (state, action) => {
    const cases = {

        [constants.users.REGISTER_DOCUMENTS_REQUEST]
        : {loading:true, error:null},

        [constants.users.REGISTER_DOCUMENTS_SUCCESS]
        : {loading:false, error:null, isDone:action.payload},

        [constants.users.REGISTER_DOCUMENTS_FAIL]
        : {loading:false, error:action.payload},

        [constants.users.REGISTER_DOCUMENTS_RESET]
        : {loading:false, error:null, isDone:null}
    }

    return cases[action.type] || {...state}
}

const updateDocuments = (state, action) => {
    const cases = {

        [constants.users.DOCUMENT_UPDATE_REQUEST]
        : {loading:true, error:null},

        [constants.users.DOCUMENT_UPDATE_SUCCESS]
        : {loading:false, error:null, isDone:action.payload},

        [constants.users.DOCUMENT_UPDATE_FAIL]
        : {loading:false, error:action.payload},

        [constants.users.DOCUMENT_UPDATE_RESET]
        : {loading:false, error:null, isDone:null}
    }

    return cases[action.type] || {...state}
}

const sendPhoneCode = (state, action) => {
    const cases = {

        [constants.users.SEND_PHONE_CODE_REQUEST]
        : {loading:true, error:null},

        [constants.users.SEND_PHONE_CODE_SUCCESS]
        : {loading:false, error:null, message:action.payload},

        [constants.users.SEND_PHONE_CODE_FAIL]
        : {loading:false, error:action.payload},

        [constants.users.SEND_PHONE_CODE_RESET] 
        : {loading:false, error:null, message:null}
    }

    return cases[action.type] || {...state}
}

const sendEmailLink = (state, action) => {
    const cases = {
        
        [constants.users.SEND_EMAIL_LINK_REQUEST]
        : {loading:true, error:null},

        [constants.users.SEND_EMAIL_LINK_SUCCESS]
        : {loading:false, error:null, message:action.payload},

        [constants.users.SEND_EMAIL_LINK_FAIL]
        : {loading:false, error:action.payload},

        [constants.users.SEND_EMAIL_LINK_RESET] 
        : {loading:false, error:null, message:null}
    }

    return cases[action.type] || {...state}
}

const sendResetLink = (state, action) => {
    const cases = {
        
        [constants.users.SEND_RESET_LINK_REQUEST]
        : {loading:true, error:null},

        [constants.users.SEND_RESET_LINK_SUCCESS]
        : {loading:false, error:null, message:action.payload},

        [constants.users.SEND_RESET_LINK_FAIL]
        : {loading:false, error:action.payload},

        [constants.users.SEND_RESET_LINK_RESET] 
        : {loading:false, error:null, message:null}
    }

    return cases[action.type] || {...state}
}

const VerifyPhoneCode = (state, action) => {
    const cases = {
        
        [constants.users.VERIFY_PHONE_CODE_REQUEST]
        : {loading:true, error:null},

        [constants.users.VERIFY_PHONE_CODE_SUCCESS]
        : {loading:false, error:null, message:action.payload},

        [constants.users.VERIFY_PHONE_CODE_FAIL]
        : {loading:false, error:action.payload},

        [constants.users.VERIFY_PHONE_CODE_RESET] 
        : {loading:false, error:null, message:null}
    }

    return cases[action.type] || {...state}
}

const VerifyAuthLink = (state, action) => {
    const cases = {
        
        [constants.users.VERIFY_AUTH_LINK_REQUEST]
        : {loading:true, error:null},

        [constants.users.VERIFY_AUTH_LINK_SUCCESS]
        : {loading:false, error:null, message:action.payload},

        [constants.users.VERIFY_AUTH_LINK_FAIL]
        : {loading:false, error:action.payload},

        [constants.users.VERIFY_AUTH_LINK_RESET] 
        : {loading:false, error:null, message:null}
    }

    return cases[action.type] || {...state}
}

const loginInit = (state, action) => {
    const cases = {
        
        [constants.users.USER_LOGIN_REQUEST]
        : {loading:true, error:null},

        [constants.users.USER_LOGIN_SUCCESS]
        : {loading:false, error:null, userId:action.payload},

        [constants.users.USER_LOGIN_FAIL]
        : {loading:false, error:action.payload},

        [constants.users.USER_LOGIN_RESET] 
        : {loading:false, error:null, userId:null}
    }

    return cases[action.type] || {...state}
}

const sendLoginCode = (state, action) => {
    const cases = {
        
        [constants.users.SEND_LOGIN_CODE_REQUEST]
        : {loading:true, error:null},

        [constants.users.SEND_LOGIN_CODE_SUCCESS]
        : {loading:false, error:null, message:action.payload},

        [constants.users.SEND_LOGIN_CODE_FAIL]
        : {loading:false, error:action.payload},

        [constants.users.SEND_LOGIN_CODE_RESET] 
        : {loading:false, error:null, message:null}
    }

    return cases[action.type] || {...state}
}

const login = (state, action) => {
    
    const cases = {
        
        [constants.users.VERIFY_LOGIN_CODE_REQUEST]
        : {loading:true, error:null},

        [constants.users.VERIFY_LOGIN_CODE_SUCCESS]
        : {loading:false, error:null, user:action.payload, isAuth:true},

        [constants.users.VERIFY_LOGIN_CODE_FAIL]
        : {loading:false, error:action.payload},

        [constants.users.VERIFY_LOGIN_CODE_RESET] 
        : {loading:false, error:null, user:null, isAuth:false}
    }

    return cases[action.type] || {...state}
}


const userProfile = (state, action) => {
    const cases = {
        
        [constants.users.USER_PROFILE_REQUEST]
        : {loading:true, error:null},

        [constants.users.USER_PROFILE_SUCCESS]
        : {loading:false, error:null, user:action.payload},

        [constants.users.USER_PROFILE_FAIL]
        : {loading:false, error:action.payload},

        [constants.users.USER_PROFILE_RESET] 
        : {loading:false, error:null, user:null}
    }

    return cases[action.type] || {...state}
}

const updatePassword = (state, action) => {
    const cases = {
        
        [constants.users.PASSWORD_UPDATE_REQUEST]:
        {
            loading:true, 
            error:null
        },

        [constants.users.PASSWORD_UPDATE_SUCCESS]: 
        {
            loading:false, 
            error:null, 
            message:action.payload
        },

        [constants.users.PASSWORD_UPDATE_FAIL]: 
        {
            loading:false, 
            error:action.payload
        },

        [constants.users.PASSWORD_UPDATE_RESET] : 
        {
            loading:false, 
            error:null, 
            message:null
        }
    }

    return cases[action.type] || {...state}
}


const logout = (state, action) => {
    const cases = {
        [constants.users.USER_LOGOUT_REQUEST]: 
        {
            loading:true, 
            error:null
        },

        [constants.users.USER_LOGOUT_SUCCESS] :
        {
            loading:false, 
            error:null, 
            isLogout:true
        },

        [constants.users.USER_LOGOUT_FAIL] : 
        {
            loading:false, 
            error:action.payload
        },

        [constants.users.USER_LOGOUT_RESET]:
        {
            loading:false, 
            error:null, 
            isLogout:false
        }
    }

    return cases[action.type] || {...state}
}

const searchUsers = (state, action) => {
    const cases = {
        [constants.users.USERS_SEARCH_REQUEST]:
        {
            loading:true, 
            error:null
        },

        [constants.users.USERS_SEARCH_SUCCESS]:
        {
            loading:false, 
            error:null, 
            users:action.payload
        },

        [constants.users.USERS_SEARCH_FAIL]: 
        {
            loading:false, 
            error:action.payload
        },

        [constants.users.USERS_SEARCH_RESET]:
        {
            loading:false, 
            error:null, 
            users:false
        }
    }

    return cases[action.type] || {...state}
}

const reducers = {
    registerCredential,
    registerInfo,
    registerDocuments,
    sendPhoneCode,
    sendEmailLink,
    sendResetLink,
    VerifyPhoneCode,
    VerifyAuthLink,
    userProfile,
    loginInit,
    sendLoginCode,
    updatePassword,
    updateDocuments,
    login,
    logout,
    searchUsers
}

export default reducers


