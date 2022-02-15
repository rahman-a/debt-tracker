import constants from "../constants";
import api from '../api'


const listAllReports = query => async dispatch => {
    dispatch({type:constants.reports.LIST_REPORTS_REQUEST}) 

    try {
        const {data} = await api.reports.index(query)
        dispatch({
            type:constants.reports.LIST_REPORTS_SUCCESS,
            reports:data.reports,
            count:data.count
        })
    } catch (error) {
        dispatch({
            type:constants.reports.LIST_REPORTS_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const updateReport = (id, info) => async (dispatch, getState) => {
    dispatch({type:constants.reports.UPDATE_REPORT_REQUEST}) 
    try {
        const {data} = await api.reports.update(id, info) 
        const {reports, count} = getState().listAllReports
        if(reports) {
            let filteredReports = reports.filter(report => report._id.toString() !== id.toString()) 
            filteredReports = [...filteredReports, data.report]
            dispatch({
                type:constants.reports.LIST_REPORTS_SUCCESS,
                reports:filteredReports,
                count
            })
        }
        
        dispatch({
            type:constants.reports.UPDATE_REPORT_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.reports.UPDATE_REPORT_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const closeReport = id => async dispatch => {
    dispatch({type: constants.reports.CLOSE_REPORT_REQUEST}) 

    try {
        const {data} = await api.reports.close(id) 
        dispatch({
            type:constants.reports.CLOSE_REPORT_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.reports.CLOSE_REPORT_FAIL,
            payload:error.response && error.response.data.message 
        })
    }
}

const actions = {
    listAllReports,
    updateReport,
    closeReport
}

export default actions