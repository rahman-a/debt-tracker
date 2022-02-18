import constants from "../constants";
import api from "../api";


const listAllOperations = query => async dispatch => {
    dispatch({type: constants.operations.LIST_OPERATIONS_REQUEST}) 

    try {
        const {data} = await api.operations.index(query) 
        dispatch({
            type:constants.operations.LIST_OPERATIONS_SUCCESS,
            operations:data.operations,
            count:data.count
        })
    } catch (error) {
        dispatch({
            type: constants.operations.LIST_OPERATIONS_FAIL,
            payload:error.response && error.response.data.message
        })
    }
}
const updateOperationState = (id,notification ,state) => async (dispatch) => {
    dispatch({type: constants.operations.UPDATE_OPERATION_STATE_REQUEST}) 
    try {
        const {data} = await api.operations.updateState(id, notification, state)
        dispatch({
            type: constants.operations.UPDATE_OPERATION_STATE_SUCCESS, 
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.operations.UPDATE_OPERATION_STATE_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}
const actions = {
    listAllOperations,
    updateOperationState
}

export default actions