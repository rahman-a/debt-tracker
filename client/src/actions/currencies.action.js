import constants from "../constants";
import api from '../api'

const listAllCurrencies = () => async (dispatch) => {
    dispatch({type:constants.currencies.LIST_CURRENCIES_REQUEST}) 
    try {
        const {data} = await api.currencies.index()
        dispatch({
            type: constants.currencies.LIST_CURRENCIES_SUCCESS, 
            payload:data.currencies
        })
    } catch (error) {
        dispatch({
            type:constants.operations.LIST_OPERATIONS_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const actions = {
    listAllCurrencies
}

export default actions