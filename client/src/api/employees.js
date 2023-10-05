import service from './service'

const employeeAPI = {
  createEmployee(data) {
    return service().post('employees/new', data)
  },
  listEmployees(data) {
    return service().get(`employees/list/${data.manager}`)
  },
  toggleBlockEmployee(id) {
    return service().patch(`employees/${id}/block`)
  },
  deleteEmployee(id) {
    return service().delete(`employees/${id}/delete`)
  },
}

export default employeeAPI
