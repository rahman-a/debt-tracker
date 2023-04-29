import download from 'js-file-download'
import constants from '../constants'
import api from '../api'

const listAllReports = (query) => async (dispatch) => {
  dispatch({ type: constants.reports.REPORTS_ALL_REQUEST })
  try {
    const { data } = await api.reports.index(query)
    dispatch({
      type: constants.reports.REPORTS_ALL_SUCCESS,
      reports: data.reports,
      count: data.count,
    })
  } catch (error) {
    dispatch({
      type: constants.reports.REPORTS_ALL_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const updateReport = (query) => async (dispatch) => {
  dispatch({ type: constants.reports.UPDATE_REPORT_REQUEST })

  try {
    const { data } = await api.reports.update(query)
    dispatch({
      type: constants.reports.UPDATE_REPORT_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.reports.UPDATE_REPORT_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const closeReport = (id) => async (dispatch, getState) => {
  dispatch({ type: constants.reports.CLOSE_REPORT_REQUEST })
  try {
    const { data } = await api.reports.close(id)
    console.log('data: ', data)
    const { reports, count } = getState().listAllReports
    if (reports) {
      const copiedReports = JSON.parse(JSON.stringify(reports))
      const filteredReports = copiedReports.filter(
        (reports) => reports._id !== id
      )
      dispatch({
        type: constants.reports.REPORTS_ALL_SUCCESS,
        reports: filteredReports,
        count: count - 1,
      })
    }
    dispatch({
      type: constants.reports.CLOSE_REPORT_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.reports.CLOSE_REPORT_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const changeDueDate = (id, date) => async (dispatch) => {
  dispatch({ type: constants.reports.DUE_DATE_CHANGE_REQUEST })

  try {
    const { data } = await api.reports.changeDueDate(id, date)
    dispatch({
      type: constants.reports.DUE_DATE_CHANGE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.reports.DUE_DATE_CHANGE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const approveDueDate = (id, date) => async (dispatch) => {
  dispatch({ type: constants.reports.DUE_DATE_APPROVE_REQUEST })

  try {
    const { data } = await api.reports.approveDueDate(id, date)
    dispatch({
      type: constants.reports.DUE_DATE_APPROVE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.reports.DUE_DATE_APPROVE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const getReportsData = (info) => async (dispatch) => {
  dispatch({ type: constants.reports.GET_REPORTS_DATA_REQUEST })

  try {
    const { data } = await api.reports.reportsData(info)
    dispatch({
      type: constants.reports.GET_REPORTS_DATA_SUCCESS,
      payload: data.reports,
    })
  } catch (error) {
    dispatch({
      type: constants.reports.GET_REPORTS_DATA_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const printReportsData = (info) => async (dispatch) => {
  console.log('🚀printReportsData ~ info:', info)
  dispatch({ type: constants.reports.PRINT_REPORTS_DATA_REQUEST })

  try {
    const { data } = await api.reports.reportsPrint(info)
    const pdfBuffer = new Uint8Array(data.pdf.data)
    download(pdfBuffer.buffer, 'report.pdf')
    dispatch({
      type: constants.reports.PRINT_REPORTS_DATA_SUCCESS,
      payload: data.pdf,
    })
  } catch (error) {
    dispatch({
      type: constants.reports.PRINT_REPORTS_DATA_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const actions = {
  listAllReports,
  updateReport,
  changeDueDate,
  approveDueDate,
  closeReport,
  getReportsData,
  printReportsData,
}

export default actions
