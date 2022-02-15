import constants from "../constants";


const listAllReports = (state, action) => {
    
    const cases = {
        [constants.reports.LIST_REPORTS_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.reports.LIST_REPORTS_SUCCESS]: 
        {
            loading:false,
            error:null,
            reports:action.reports,
            count:action.count
        },
        [constants.reports.LIST_REPORTS_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.reports.LIST_REPORTS_RESET]: 
        {
            loading:false,
            error:null,
            reports:null,
            count:0
        }
    }

    return cases[action.type] || {...state}
}

const updateReport = (state, action) => {
    
    const cases = {
        [constants.reports.UPDATE_REPORT_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.reports.UPDATE_REPORT_SUCCESS]: 
        {
            loading:false,
            error:null,
            message:action.payload,
        },
        [constants.reports.UPDATE_REPORT_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.reports.UPDATE_REPORT_RESET]: 
        {
            loading:false,
            error:null,
            message:null,
        }
    }

    return cases[action.type] || {...state}
}

const closeReport = (state, action) => {
    
    const cases = {
        [constants.reports.CLOSE_REPORT_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.reports.CLOSE_REPORT_SUCCESS]: 
        {
            loading:false,
            error:null,
            message:action.payload,
        },
        [constants.reports.CLOSE_REPORT_FAIL]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.reports.CLOSE_REPORT_RESET]: 
        {
            loading:false,
            error:null,
            message:null,
        }
    }

    return cases[action.type] || {...state}
}


const reducer = {
    listAllReports,
    updateReport,
    closeReport
}

export default reducer