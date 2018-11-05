import Api from './Api'

export default {
  index (type, id, sort, page) {
    var request = `/comments/${type}/${id}?sort=${sort}&page=${page}`
    console.log(request)
    return Api().get(request)
  },
  show (id) {
    return Api().get(`comment/${id}`)
  },
  create (credentials) {
    return Api().post(`comment`, credentials)
  },
  update (id, credentials) {
    return Api().put(`comment/${id}`, credentials)
  },
  deleteTag (id, tag) {
    return Api().delete(`comment/tag?comment_id=${id}&tag_slug=${tag}`)
  },
  delete (id) {
    return Api().delete(`comment/${id}`)
  }
}
