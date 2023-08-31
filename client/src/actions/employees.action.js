import constants from '../constants'
import api from '../api'

const createEmployee = (info) => async (dispatch) => {
  dispatch({ type: constants.employees.CREATE_EMPLOYEE_REQUEST })

  try {
    const { data } = await api.employees.createEmployee(info)
    dispatch({
      type: constants.employees.CREATE_EMPLOYEE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.employees.CREATE_EMPLOYEE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const listEmployees = (info) => async (dispatch) => {
  dispatch({ type: constants.employees.LIST_EMPLOYEES_REQUEST })

  try {
    const { data } = await api.employees.listEmployees(info)
    dispatch({
      type: constants.employees.LIST_EMPLOYEES_SUCCESS,
      payload: data.employees,
    })
  } catch (error) {
    dispatch({
      type: constants.employees.LIST_EMPLOYEES_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const deleteEmployee = (id) => async (dispatch, getState) => {
  dispatch({ type: constants.employees.DELETE_EMPLOYEE_REQUEST })
  try {
    const { data } = await api.employees.deleteEmployee(id)
    const { employees } = getState().listEmployees
    if (employees && employees.length > 0) {
      const updatedEmployees = employees.filter(
        (employee) => employee._id.toString() !== id.toString()
      )
      dispatch({
        type: constants.employees.LIST_EMPLOYEES_SUCCESS,
        payload: updatedEmployees,
      })
    }
    dispatch({
      type: constants.employees.DELETE_EMPLOYEE_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: constants.employees.DELETE_EMPLOYEE_FAIL,
      payload: error.response && error.response.data.message,
    })
  }
}

const actions = {
  createEmployee,
  listEmployees,
  deleteEmployee,
}

export default actions
