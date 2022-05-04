import constants from "../constants";


const listCurrencies = (state, action) => {
    const cases = {
        [constants.currencies.LIST_CURRENCIES_REQUEST]: 
        {
            loading:true,
            error:null 
        },
        [constants.currencies.LIST_CURRENCIES_SUCCESS]: 
        {
            loading:false,
            error:null,
            currencies:action.payload
        },
        [constants.currencies.LIST_CURRENCIES_FAIL]: 
        {
            loading:false,
            error:action.payload 
        },
        [constants.currencies.LIST_CURRENCIES_RESET]: 
        {
            loading:false,
            error:null,
            currencies:null
        }
    }

    return cases[action.type] || {...state}
}

const reducers = {
    listCurrencies
}

export default reducers