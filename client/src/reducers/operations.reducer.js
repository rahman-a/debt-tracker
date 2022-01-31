import constants from '../constants'


/////////////////////////////////////////////////
/////////// LIST ALL OPERATIONS REDUCER
//////////////////////////////////////////////// 

const listOperations = (state, action) => {
    const cases = {
        
        [constants.operations.LIST_OPERATIONS_REQUEST] : 
        {
            loading:true, 
            error:null
        }, 

        [constants.operations.LIST_OPERATIONS_SUCCESS] : 
        {
            loading:false, 
            error:null, 
            operations:action.operations,
            count:action.count
        }, 

        [constants.operations.LIST_OPERATIONS_FAIL] : 
        {
            loading:false, 
            error:action.payload
        },
        
        [constants.operations.LIST_OPERATIONS_RESET] : 
        {
            loading:false, 
            error:null, 
            operations:null
        }

    }

    return cases[action.type] || {...state}
}

/////////////////////////////////////////////////
/////////// GET OPERATION REDUCER
//////////////////////////////////////////////// 
const getOperation = (state, action) => {
    const cases = {
        
        [constants.operations.GET_OPERATION_REQUEST] : 
        {
            loading:true, 
            error:null
        }, 

        [constants.operations.GET_OPERATION_SUCCESS] : 
        {
            loading:false, 
            error:null, 
            operation:action.payload,
        }, 

        [constants.operations.GET_OPERATION_FAIL] : 
        {
            loading:false, 
            error:action.payload
        },
        
        [constants.operations.GET_OPERATION_RESET] : 
        {
            loading:false, 
            error:null, 
            operations:null
        }

    }

    return cases[action.type] || {...state}
}

/////////////////////////////////////////////////
/////////// FIND ALL MUTUAL OPERATIONS REDUCER
//////////////////////////////////////////////// 

const findMutualOperations = (state, action) => {
    const cases = {
        [constants.operations.FIND_MUTUAL_REQUEST] : 
        {
            loading:true,
             error:null
        }, 

        [constants.operations.FIND_MUTUAL_SUCCESS] : 
        {
            loading:false, error:null, 
            isFound:action.isFound,  
            operations:action.operations
        }, 

        [constants.operations.FIND_MUTUAL_FAIL] : 
        {
            loading:false, 
            error:action.payload
        },
        
        [constants.operations.FIND_MUTUAL_RESET] : 
        {
            loading:false, 
            error:null, 
            operations:null, 
            isFound:false
        }

    }

    return cases[action.type] || {...state}
}

/////////////////////////////////////////////////
/////////// CREATE NEW OPERATION REDUCER
//////////////////////////////////////////////// 

const createOperation = (state, action) => {
    const cases = {
        [constants.operations.CREATE_OPERATION_REQUEST] :
        {
            loading:true, 
            error:null
        }, 

        [constants.operations.CREATE_OPERATION_SUCCESS] :
        {
            loading:false, 
            error:null, 
            id:action.id, 
            message:action.message
        }, 

        [constants.operations.CREATE_OPERATION_FAIL] : 
        {
            loading:false, 
            error:action.payload
        },
        
        [constants.operations.CREATE_OPERATION_RESET] : 
        {
            loading:false, 
            error:null, 
            message:null,
            id:null
        }

    }

    return cases[action.type] || {...state}
}

/////////////////////////////////////////////////
///////////UPDATE OPERATION STATE REDUCER
//////////////////////////////////////////////// 

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

const reducers = {
    listOperations,
    createOperation,
    getOperation,
    findMutualOperations,
    updateOperationState
}

export default reducers