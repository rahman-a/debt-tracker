import service from './service'

const contentAPI = {
  listNews: () => {
    return service().get('content/news')
  },
  getContent: (type) => {
    return service().get(`content?type=${type}`)
  },
  createContent: (data) => {
    return service().post('content', data)
  },
  updateContent: (id, data) => {
    return service().patch(`content/${id}`, data)
  },
  deleteContent: (id) => {
    return service().delete(`content/${id}`)
  },
  listSlider: () => {
    return service().get('content/slider')
  },
  addSlider: (data) => {
    return service().post('content/slider', data)
  },
  editSlider: (id, data) => {
    return service().patch(`content/slider/${id}`, data)
  },
  deleteSlider: (id) => {
    return service().delete(`content/slider/${id}`)
  },
  listSocial: () => {
    return service().get('social')
  },
  createSocial: (data) => {
    return service().post('social', data)
  },
  deleteSocial: (id) => {
    return service().delete(`social/${id}`)
  },
}

export default contentAPI
