import service from './service'

const aboutAPI = {
  createContent(data) {
    return service().post('about', data)
  },
  getContent() {
    return service().get('about')
  },
  updateHeadline(id, data) {
    return service().put(`about/${id}`, data)
  },
  createAboutItem(id, data) {
    return service().patch(`about/item/${id}`, data)
  },
  updateAboutItem(id, data) {
    return service().patch(`about/item/update/${id}`, data)
  },
  deleteAboutItem(id) {
    return service().delete(`about/item/${id}`)
  },
}

export default aboutAPI
