import constants from "../constants";

const listAllOperations = (state, action) => {
    const cases = {
        [constants.operations.LIST_OPERATIONS_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.operations.LIST_OPERATIONS_SUCCESS]: 
        {
            loading:false,
            operations:action.operations,
            count:action.count,
            error:null
        },
        [constants.operations.LIST_OPERATIONS_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.operations.LIST_OPERATIONS_RESET]: 
        {
            loading:false,
            operations:null,
            count:0,
            error:null
        }
    }

    return cases[action.type] || {...state}
}

const getOperation = (state, action) => {
    const cases = {
        [constants.operations.GET_OPERATION_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.operations.GET_OPERATION_SUCCESS]: 
        {
            loading:false,
            operation:action.payload,
            error:null
        },
        [constants.operations.GET_OPERATION_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.operations.GET_OPERATION_RESET]: 
        {
            loading:false,
            operation:null,
            error:null
        }
    }

    return cases[action.type] || {...state}
}

const deleteOperation = (state, action) => {
    const cases = {
        [constants.operations.DELETE_OPERATION_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.operations.DELETE_OPERATION_SUCCESS]: 
        {
            loading:false,
            message:action.payload,
            error:null
        },
        [constants.operations.DELETE_OPERATION_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.operations.DELETE_OPERATION_RESET]: 
        {
            loading:false,
            message:null,
            error:null
        }
    }

    return cases[action.type] || {...state}
}

const declineOperation = (state, action) => {
    const cases = {
        [constants.operations.DECLINE_OPERATION_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.operations.DECLINE_OPERATION_SUCCESS]: 
        {
            loading:false,
            message:action.payload,
            error:null
        },
        [constants.operations.DECLINE_OPERATION_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.operations.DECLINE_OPERATION_RESET]: 
        {
            loading:false,
            message:null,
            error:null
        }
    }

    return cases[action.type] || {...state}
}

const updateOperationState = (state, action) => {
    const cases = {
        [constants.operations.UPDATE_OPERATION_STATE_REQUEST] : 
        {
            loading:true, 
            error:null
        }, 

        [constants.operations.UPDATE_OPERATION_STATE_SUCCESS]:
        {
            loading:false, 
            error:null, 
            message:action.payload
        }, 

        [constants.operations.UPDATE_OPERATION_STATE_FAIL] : 
        {
            loading:false, 
            error:action.payload
        },
        
        [constants.operations.UPDATE_OPERATION_STATE_RESET] : 
        {
            loading:false, 
            error:null, 
            message:null
        }

    }

    return cases[action.type] || {...state}
}

const reducer = {
    listAllOperations,
    getOperation,
    deleteOperation,
    updateOperationState,
    declineOperation
}

export default reducer