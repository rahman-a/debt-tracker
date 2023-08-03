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
    console.log('close reports data: ', data)
    const { reports, count } = getState().listAllReports
    if (reports?.length && !data.fineNotPaid) {
      const filteredReports = reports.filter((reports) => reports._id !== id)
      dispatch({
        type: constants.reports.REPORTS_ALL_SUCCESS,
        reports: filteredReports,
        count: count - 1,
      })
    }
    if (reports?.length && data.fineNotPaid) {
      const updatedReports = reports.map((report) => {
        if (report._id === id) {
          return {
            ...report,
            paymentDate: data.paidAt,
          }
        }
        return report
      })
      dispatch({
        type: constants.reports.REPORTS_ALL_SUCCESS,
        reports: updatedReports,
        count,
      })
    }
    dispatch({
      type: constants.reports.CLOSE_REPORT_SUCCESS,
      payload: {
        message: data.message,
        fineNotPaid: data.fineNotPaid,
      },
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

const getStripePublishableKey = () => async (dispatch) => {
  dispatch({ type: constants.reports.GET_STRIPE_PUBLISHABLE_KEY_REQUEST })

  try {
    const { data } = await api.reports.getStripePublishableKey()
    dispatch({
      type: constants.reports.GET_STRIPE_PUBLISHABLE_KEY_SUCCESS,
      payload: data.publishableKey,
    })
  } catch (error) {
    dispatch({
      type: constants.reports.GET_STRIPE_PUBLISHABLE_KEY_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const getStripeClientKey = (info) => async (dispatch) => {
  dispatch({ type: constants.reports.GET_STRIPE_CLIENT_KEY_REQUEST })

  try {
    const { data } = await api.reports.getStripeClientSecretKey(info)
    dispatch({
      type: constants.reports.GET_STRIPE_CLIENT_KEY_SUCCESS,
      payload: data.clientSecret,
    })
  } catch (error) {
    dispatch({
      type: constants.reports.GET_STRIPE_CLIENT_KEY_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const finalizeFinePayment = (info) => async (dispatch, getState) => {
  dispatch({ type: constants.reports.FINALIZE_FINE_PAYMENT_REQUEST })

  try {
    const { data } = await api.reports.finalizeFinePayment(info)
    const { reports, count } = getState().listAllReports
    // update the payment status of the delayed fine in the reports list
    // when the main transaction is still active and not paid yet
    if (reports?.length > 0 && data.isTransactionActive) {
      const updatedReports = reports.map((report) => {
        if (report._id === info.reportId) {
          if (
            report.operation.initiator.type === 'debt' &&
            report.operation.initiator.delayedFine?.amount
          ) {
            report.operation.initiator.delayedFine.paidAt = data.paidAt
          } else if (report.operation.peer.delayedFine?.amount) {
            report.operation.peer.delayedFine.paidAt = data.paidAt
          }
        }
        return report
      })
      dispatch({
        type: constants.reports.REPORTS_ALL_SUCCESS,
        reports: updatedReports,
        count,
      })
    }
    dispatch({
      type: constants.reports.FINALIZE_FINE_PAYMENT_SUCCESS,
      payload: {
        message: data.message,
        isTransactionActive: data.isTransactionActive,
        isSuccess: data.success,
      },
    })
  } catch (error) {
    dispatch({
      type: constants.reports.FINALIZE_FINE_PAYMENT_FAIL,
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
  getStripePublishableKey,
  getStripeClientKey,
  finalizeFinePayment,
}

export default actions
