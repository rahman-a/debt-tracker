import constants from "../constants";
import api from '../api'


const listAllOperations = (query) => async (dispatch) => {
    dispatch({type:constants.operations.LIST_OPERATIONS_REQUEST}) 
    try {
        const {data} = await api.operations.index(query)
        dispatch({
            type: constants.operations.LIST_OPERATIONS_SUCCESS,
            operations:data.operations,
            count:data.count
        })
    } catch (error) {
        dispatch({
            type:constants.operations.LIST_OPERATIONS_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const getOperation = (id) => async (dispatch) => {
    dispatch({type:constants.operations.GET_OPERATION_REQUEST}) 
    try {
        const {data} = await api.operations.getOne(id)
        dispatch({type: constants.operations.GET_OPERATION_SUCCESS, payload:data.operation})
    } catch (error) {
        dispatch({
            type:constants.operations.GET_OPERATION_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const findMutualOperation = (initiator, peer) => async (dispatch) => {
    dispatch({type: constants.operations.FIND_MUTUAL_REQUEST}) 
    try {
        const {data} = await api.operations.findMutual(initiator, peer)
        dispatch({
            type: constants.operations.FIND_MUTUAL_SUCCESS,
            isFound:true,
            operations:data.operations
        })
    } catch (error) {
        dispatch({
            type:constants.operations.FIND_MUTUAL_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const createOperation = (info) => async (dispatch) => {
    dispatch({type: constants.operations.CREATE_OPERATION_REQUEST}) 
    try {
        const {data} = await api.operations.create(info)
        dispatch({
            type: constants.operations.CREATE_OPERATION_SUCCESS,
            id:data.id,
            message:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.operations.CREATE_OPERATION_FAIL, 
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
    createOperation,
    updateOperationState,
    getOperation,
    findMutualOperation
}

export default actions