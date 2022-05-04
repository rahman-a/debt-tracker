import service from './service'

const contentAPI = {
  listSliders: () => {
    return service().get('/content/slider')
  },
  getAboutUs: () => {
    return service().get('/content?type=about')
  },
  getContactUs: () => {
    return service().get('/content?type=contact')
  },
  listNews: () => {
    return service().get('/content/news')
  },
  getArticle: (id) => {
    return service().get(`/article/${id}`)
  },
  increaseViews: (id) => {
    return service().patch(`/article/views/${id}`)
  },
  listSocial: () => {
    return service().get('social')
  },
}

export default contentAPI
