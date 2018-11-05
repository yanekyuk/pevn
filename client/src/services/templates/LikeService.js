import Api from './Api'

export default {
  posts (id, page) {
    return Api().get(`user/${id}/likes/posts?page=${page}`)
  },
  index (type, id) {
    return Api().get(`likes/${type}/${id}`)
  },
  create (credentials) {
    return Api().post('like', credentials)
  },
  delete (id) {
    return Api().delete(`like/${id}`)
  }
}
