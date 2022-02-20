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

const members = (state, action) => {
    const cases = {
        [constants.admin.USERS_LIST_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.admin.USERS_LIST_SUCCESS]: 
        {
            loading:false,
            error:null,
            members:action.users,
            count:action.count
        },
        [constants.admin.USERS_LIST_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.admin.USERS_LIST_RESET]: 
        {
            loading:false,
            error:null,
            members:null,
            count:0
        }
    }
    return cases[action.type] || {...state}
}

const member = (state, action) => {
    const cases = {
        [constants.admin.USER_DATA_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.admin.USER_DATA_SUCCESS]: 
        {
            loading:false,
            error:null,
            member:action.payload,
        },
        [constants.admin.USER_DATA_FAIL]: 
        {
            loading:false,
            error:action.payload 
        },
        [constants.admin.USER_DATA_RESET]: 
        {
            loading:false,
            error:null,
            member:null
        }

    }

    return cases[action.type] || {...state}
}


const toggleUser = (state, action) => {
    const cases = {
        [constants.admin.USER_TOGGLE_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.admin.USER_TOGGLE_SUCCESS]: 
        {
            loading:false,
            error:null,
            isConfirmed:action.payload,
        },
        [constants.admin.USER_TOGGLE_FAIL]: 
        {
            loading:false,
            error:action.payload 
        },
        [constants.admin.USER_TOGGLE_RESET]: 
        {
            loading:false,
            error:null,
            isConfirmed:null
        }

    }

    return cases[action.type] || {...state}
}

const userColorCode = (state, action) => {
    const cases = {
        [constants.admin.USER_COLOR_CHANGE_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.admin.USER_COLOR_CHANGE_SUCCESS]: 
        {
            loading:false,
            error:null,
            message:action.payload,
        },
        [constants.admin.USER_COLOR_CHANGE_FAIL]: 
        {
            loading:false,
            error:action.payload 
        },
        [constants.admin.USER_COLOR_CHANGE_RESET]: 
        {
            loading:false,
            error:null,
            message:null
        }

    }

    return cases[action.type] || {...state}
}

const deleteUser = (state, action) => {
    const cases = {
        [constants.admin.USER_DELETE_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.admin.USER_DELETE_SUCCESS]: 
        {
            loading:false,
            error:null,
            message:action.payload,
        },
        [constants.admin.USER_DELETE_FAIL]: 
        {
            loading:false,
            error:action.payload 
        },
        [constants.admin.USER_DELETE_RESET]: 
        {
            loading:false,
            error:null,
            message:null
        }

    }

    return cases[action.type] || {...state}
}


const changeUserRole = (state, action) => {
    
    const cases = {
        [constants.admin.USER_ROLE_CHANGE_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.admin.USER_ROLE_CHANGE_SUCCESS]: 
        {
            loading:false,
            error:null,
            message:action.payload,
        },
        [constants.admin.USER_ROLE_CHANGE_FAIL]: 
        {
            loading:false,
            error:action.payload 
        },
        [constants.admin.USER_ROLE_CHANGE_RESET]: 
        {
            loading:false,
            error:null,
            message:null
        }
    }

    return cases[action.type] || {...state}
}

const createProvider = (state, action) => {
    
    const cases = {
        [constants.admin.CREATE_PROVIDER_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.admin.CREATE_PROVIDER_SUCCESS]: 
        {
            loading:false,
            error:null,
            message:action.payload,
        },
        [constants.admin.CREATE_PROVIDER_FAIL]: 
        {
            loading:false,
            error:action.payload 
        },
        [constants.admin.CREATE_PROVIDER_RESET]: 
        {
            loading:false,
            error:null,
            message:null
        }
    }

    return cases[action.type] || {...state}
}

const appInfo = (state, action) => {
    
    const cases = {
        [constants.admin.APP_INFO_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.admin.APP_INFO_SUCCESS]: 
        {
            loading:false,
            error:null,
            info:action.payload,
        },
        [constants.admin.APP_INFO_FAIL]: 
        {
            loading:false,
            error:action.payload 
        },
        [constants.admin.APP_INFO_RESET]: 
        {
            loading:false,
            error:null,
            info:null
        }
    }

    return cases[action.type] || {...state}
}

const latestMembers = (state, action) => {
    
    const cases = {
        [constants.admin.MEMBERS_LATEST_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.admin.MEMBERS_LATEST_SUCCESS]: 
        {
            loading:false,
            error:null,
            members:action.payload,
        },
        [constants.admin.MEMBERS_LATEST_FAIL]: 
        {
            loading:false,
            error:action.payload 
        },
        [constants.admin.MEMBERS_LATEST_RESET]: 
        {
            loading:false,
            error:null,
            members:null
        }
    }

    return cases[action.type] || {...state}
}

const latestTickets = (state, action) => {
    
    const cases = {
        [constants.admin.TICKETS_LATEST_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.admin.TICKETS_LATEST_SUCCESS]: 
        {
            loading:false,
            error:null,
            tickets:action.payload,
        },
        [constants.admin.TICKETS_LATEST_FAIL]: 
        {
            loading:false,
            error:action.payload 
        },
        [constants.admin.TICKETS_LATEST_RESET]: 
        {
            loading:false,
            error:null,
            tickets:null
        }
    }

    return cases[action.type] || {...state}
}

const latestOperations = (state, action) => {
    
    const cases = {
        [constants.admin.OPERATIONS_LATEST_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.admin.OPERATIONS_LATEST_SUCCESS]: 
        {
            loading:false,
            error:null,
            operations:action.payload,
        },
        [constants.admin.OPERATIONS_LATEST_FAIL]: 
        {
            loading:false,
            error:action.payload 
        },
        [constants.admin.OPERATIONS_LATEST_RESET]: 
        {
            loading:false,
            error:null,
            operations:null
        }
    }

    return cases[action.type] || {...state}
}

const latestReports = (state, action) => {
    
    const cases = {
        [constants.admin.REPORTS_LATEST_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.admin.REPORTS_LATEST_SUCCESS]: 
        {
            loading:false,
            error:null,
            reports:action.payload,
        },
        [constants.admin.REPORTS_LATEST_FAIL]: 
        {
            loading:false,
            error:action.payload 
        },
        [constants.admin.REPORTS_LATEST_RESET]: 
        {
            loading:false,
            error:null,
            reports:null
        }
    }

    return cases[action.type] || {...state}
}

const reducer = {
    login,
    sendResetLink,
    VerifyAuthLink,
    logout,
    members,
    member,
    toggleUser,
    userColorCode,
    deleteUser,
    createProvider,
    changeUserRole,
    appInfo,
    latestMembers,
    latestTickets,
    latestOperations,
    latestReports
}

export default reducer