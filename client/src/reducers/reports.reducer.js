import constants from '../constants'

const listAllReports = (state, action) => {
  const cases = {
    [constants.reports.REPORTS_ALL_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.reports.REPORTS_ALL_SUCCESS]: {
      loading: false,
      error: null,
      reports: action.reports,
      count: action.count,
    },
    [constants.reports.REPORTS_ALL_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.reports.REPORTS_ALL_RESET]: {
      loading: false,
      error: null,
      reports: null,
      count: 0,
    },
  }

  return cases[action.type] || { ...state }
}

const updateReport = (state, action) => {
  const cases = {
    [constants.reports.UPDATE_REPORT_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.reports.UPDATE_REPORT_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },
    [constants.reports.UPDATE_REPORT_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.reports.UPDATE_REPORT_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const closeReport = (state, action) => {
  const cases = {
    [constants.reports.CLOSE_REPORT_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.reports.CLOSE_REPORT_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload?.message,
      fineNotPaid: action.payload?.fineNotPaid,
    },
    [constants.reports.CLOSE_REPORT_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.reports.CLOSE_REPORT_RESET]: {
      loading: false,
      error: null,
      message: null,
      fineNotPaid: null,
    },
  }

  return cases[action.type] || { ...state }
}

const updateDueDate = (state, action) => {
  const cases = {
    [constants.reports.DUE_DATE_CHANGE_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.reports.DUE_DATE_CHANGE_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },
    [constants.reports.DUE_DATE_CHANGE_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.reports.DUE_DATE_CHANGE_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const approveDueDate = (state, action) => {
  const cases = {
    [constants.reports.DUE_DATE_APPROVE_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.reports.DUE_DATE_APPROVE_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },
    [constants.reports.DUE_DATE_APPROVE_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.reports.DUE_DATE_APPROVE_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const getReportsData = (state, action) => {
  const cases = {
    [constants.reports.GET_REPORTS_DATA_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.reports.GET_REPORTS_DATA_SUCCESS]: {
      loading: false,
      error: null,
      reports: action.payload,
    },
    [constants.reports.GET_REPORTS_DATA_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.reports.GET_REPORTS_DATA_RESET]: {
      loading: false,
      error: null,
      reports: null,
    },
  }

  return cases[action.type] || { ...state }
}

const printReportsData = (state, action) => {
  const cases = {
    [constants.reports.PRINT_REPORTS_DATA_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.reports.PRINT_REPORTS_DATA_SUCCESS]: {
      loading: false,
      error: null,
      buffer: action.payload,
    },
    [constants.reports.PRINT_REPORTS_DATA_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.reports.PRINT_REPORTS_DATA_RESET]: {
      loading: false,
      error: null,
      buffer: null,
    },
  }

  return cases[action.type] || { ...state }
}

const getStripePublishableKey = (state, action) => {
  const cases = {
    [constants.reports.GET_STRIPE_PUBLISHABLE_KEY_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.reports.GET_STRIPE_PUBLISHABLE_KEY_SUCCESS]: {
      loading: false,
      error: null,
      stripePublishableKey: action.payload,
    },
    [constants.reports.GET_STRIPE_PUBLISHABLE_KEY_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.reports.GET_STRIPE_PUBLISHABLE_KEY_RESET]: {
      loading: false,
      error: null,
      stripePublishableKey: null,
    },
  }

  return cases[action.type] || { ...state }
}

const getStripeClientKey = (state, action) => {
  const cases = {
    [constants.reports.GET_STRIPE_CLIENT_KEY_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.reports.GET_STRIPE_CLIENT_KEY_SUCCESS]: {
      loading: false,
      error: null,
      stripeClientKey: action.payload,
    },
    [constants.reports.GET_STRIPE_CLIENT_KEY_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.reports.GET_STRIPE_CLIENT_KEY_RESET]: {
      loading: false,
      error: null,
      stripeClientKey: null,
    },
  }

  return cases[action.type] || { ...state }
}

const finalizeFinePayment = (state, action) => {
  const cases = {
    [constants.reports.FINALIZE_FINE_PAYMENT_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.reports.FINALIZE_FINE_PAYMENT_SUCCESS]: {
      loading: false,
      error: null,
      isTransactionActive: action.payload?.isTransactionActive,
      isSuccess: action.payload?.isSuccess,
    },
    [constants.reports.FINALIZE_FINE_PAYMENT_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.reports.FINALIZE_FINE_PAYMENT_RESET]: {
      loading: false,
      error: null,
      isTransactionActive: false,
      isSuccess: false,
    },
  }

  return cases[action.type] || { ...state }
}

const reducer = {
  listAllReports,
  updateReport,
  updateDueDate,
  approveDueDate,
  closeReport,
  getReportsData,
  printReportsData,
  getStripePublishableKey,
  getStripeClientKey,
  finalizeFinePayment,
}

export default reducer
