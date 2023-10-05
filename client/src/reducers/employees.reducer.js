import constants from '../constants'

const createEmployee = (state, action) => {
  const cases = {
    [constants.employees.CREATE_EMPLOYEE_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.employees.CREATE_EMPLOYEE_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },
    [constants.employees.CREATE_EMPLOYEE_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.employees.CREATE_EMPLOYEE_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const listEmployees = (state, action) => {
  const cases = {
    [constants.employees.LIST_EMPLOYEES_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.employees.LIST_EMPLOYEES_SUCCESS]: {
      loading: false,
      error: null,
      employees: action.payload,
    },
    [constants.employees.LIST_EMPLOYEES_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.employees.LIST_EMPLOYEES_RESET]: {
      loading: false,
      error: null,
      employees: null,
    },
  }

  return cases[action.type] || { ...state }
}

const deleteEmployee = (state, action) => {
  const cases = {
    [constants.employees.DELETE_EMPLOYEE_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.employees.DELETE_EMPLOYEE_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },
    [constants.employees.DELETE_EMPLOYEE_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.employees.DELETE_EMPLOYEE_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const toggleBlockEmployee = (state, action) => {
  const cases = {
    [constants.employees.TOGGLE_BLOCK_EMPLOYEE_REQUEST]: {
      loading: true,
      error: null,
    },
    [constants.employees.TOGGLE_BLOCK_EMPLOYEE_SUCCESS]: {
      loading: false,
      error: null,
      message: action.payload,
    },
    [constants.employees.TOGGLE_BLOCK_EMPLOYEE_FAIL]: {
      loading: false,
      error: action.payload,
    },
    [constants.employees.TOGGLE_BLOCK_EMPLOYEE_RESET]: {
      loading: false,
      error: null,
      message: null,
    },
  }

  return cases[action.type] || { ...state }
}

const reducers = {
  createEmployee,
  listEmployees,
  toggleBlockEmployee,
  deleteEmployee,
}

export default reducers
