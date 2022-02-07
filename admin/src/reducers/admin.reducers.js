import constants from "../constants";

const login = (state, action) => {
    const cases = {
        [constants.admin.ADMIN_LOGIN_REQUEST]: 
        {
            loading:true, 
            error:null
        },
        
        [constants.admin.ADMIN_LOGIN_SUCCESS]: 
        {
            loading:false, 
            error:null, 
            staff:action.staff, 
            isAuth:action.isAuth
        },

        [constants.admin.ADMIN_LOGIN_FAIL]: 
        {
            loading:false,
             error:action.payload
        }, 

        [constants.admin.ADMIN_LOGIN_RESET]: 
        {
            loading:false, 
            error:null, 
            staff:null, 
            isAuth:false
        }
    }

    return cases[action.type] || {...state}
}

const logout = (state, action) => {
    const cases = {
        [constants.admin.ADMIN_LOGOUT_REQUEST]: 
        {
            loading:true, 
            error:null
        },

        [constants.admin.ADMIN_LOGOUT_SUCCESS] :
        {
            loading:false, 
            error:null, 
            isLogout:true
        },

        [constants.admin.ADMIN_LOGOUT_FAIL] : 
        {
            loading:false, 
            error:action.payload
        },

        [constants.admin.ADMIN_LOGOUT_RESET]:
        {
            loading:false, 
            error:null, 
            isLogout:false
        }
    }

    return cases[action.type] || {...state}
}

const sendResetLink = (state, action) => {
    const cases = {
        
        [constants.admin.SEND_RESET_LINK_REQUEST]: 
        {
            loading:true, 
            error:null
        },

        [constants.admin.SEND_RESET_LINK_SUCCESS]: 
        {
            loading:false, 
            error:null, 
            message:action.payload
        },

        [constants.admin.SEND_RESET_LINK_FAIL]: 
        {
            loading:false, 
            error:action.payload
        },

        [constants.admin.SEND_RESET_LINK_RESET] : 
        {
            loading:false, 
            error:null, 
            message:null
        }
    }

    return cases[action.type] || {...state}
}

const VerifyAuthLink = (state, action) => {
    const cases = {
        
        [constants.admin.VERIFY_AUTH_LINK_REQUEST]: 
        {
            loading:true, 
            error:null},

        [constants.admin.VERIFY_AUTH_LINK_SUCCESS]: 
        {
            loading:false,
            error:null, 
            message:action.payload
        },

        [constants.admin.VERIFY_AUTH_LINK_FAIL]: 
        {
            loading:false,
            error:action.payload
        },

        [constants.admin.VERIFY_AUTH_LINK_RESET] : 
        {
            loading:false,
            error:null, 
            message:null
        }
    }

    return cases[action.type] || {...state}
}

const reducer = {
    login,
    sendResetLink,
    VerifyAuthLink,
    logout
}

export default reducer