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


const closeReport = id => async (dispatch, getState) => {
    dispatch({type:constants.reports.CLOSE_REPORT_REQUEST}) 
    try {
        const {data} = await api.reports.close(id) 
        const {reports, count} = getState().listAllReports 
        if(reports) {
            const copiedReports = JSON.parse(JSON.stringify(reports)) 
            const filteredReports = copiedReports.filter(reports => reports._id !== id) 
            dispatch({
                type:constants.reports.REPORTS_ALL_SUCCESS,
                reports:filteredReports,
                count:count - 1
            })
        }
        dispatch({type:constants.reports.CLOSE_REPORT_SUCCESS, payload:data.message})
    } catch (error) {
        dispatch({
            type:constants.reports.CLOSE_REPORT_FAIL,
            payload:error.response && error.response.data.message
        })
    }
}


const changeDueDate = (id, date) => async dispatch => {
    dispatch({type:constants.reports.DUE_DATE_CHANGE_REQUEST}) 

    try {
        const {data} = await api.reports.changeDueDate(id, date) 
        dispatch({
            type:constants.reports.DUE_DATE_CHANGE_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.reports.DUE_DATE_CHANGE_FAIL,
            payload:error.response && error.response.data.message
        })
    }
}

const approveDueDate = (id, date) => async dispatch => {
    dispatch({type:constants.reports.DUE_DATE_APPROVE_REQUEST}) 

    try {
        const {data} = await api.reports.approveDueDate(id, date)
        dispatch({
            type:constants.reports.DUE_DATE_APPROVE_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.reports.DUE_DATE_APPROVE_FAIL,
            payload:error.response && error.response.data.message
        })
    }
}

const actions = {
    listAllReports,
    updateReport,
    changeDueDate,
    approveDueDate,
    closeReport
}

export default actions