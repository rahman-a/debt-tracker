import service from './service'

const employeeAPI = {
  createEmployee(data) {
    return service().post('employees/new', data)
  },
  listEmployees(data) {
    return service().get(`employees/list/${data.manager}`)
  },
  deleteEmployee(id) {
    return service().delete(`employees/delete/${id}`)
  },
}

export default employeeAPI
