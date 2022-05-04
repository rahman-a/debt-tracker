import service from './service'

const articleAPI = {
  listArticles: (title) => {
    const url = title ? `/article?title=${title}` : '/article'
    return service().get(url)
  },
  getArticle: (id) => {
    return service().get(`/article/${id}`)
  },
  createArticle: (data) => {
    return service().post('/article', data)
  },
  updateArticle: (id, data) => {
    return service().patch(`/article/${id}`, data)
  },
  deleteArticle: (id) => {
    return service().delete(`/article/${id}`)
  },
}

export default articleAPI
