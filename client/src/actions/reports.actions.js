import constants from "../constants";
import api from '../api'


const listAllReports = (query) => async (dispatch) => {
    dispatch({type:constants.reports.REPORTS_ALL_REQUEST})
    try {
        const {data}  = await api.reports.index(query)
        dispatch({
            type:constants.reports.REPORTS_ALL_SUCCESS,
            reports:data.reports,
            count:data.count
        })
    } catch (error) {
        dispatch({
            type:constants.reports.REPORTS_ALL_FAIL, 
            payload:error.response && error.response.data.message 
        })
    }
}

const updateReport = (query) => async (dispatch) => {
    dispatch({type:constants.reports.UPDATE_REPORT_REQUEST}) 

    try {
        const {data} = await api.reports.update(query)
        dispatch({
            type:constants.reports.UPDATE_REPORT_SUCCESS,
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type:constants.reports.UPDATE_REPORT_FAIL,
            payload:error.response && error.response.data.message
        })
    }
}

const actions = {
    listAllReports,
    updateReport
}

export default actions