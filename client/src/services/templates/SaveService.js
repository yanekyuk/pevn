import Api from './Api'

export default {
  posts (id, page) {
    return Api().get(`/user/${id}/saves/posts?page=${page}`)
  },
  comments (page) {
    return Api().get(`saves/comments?page=${page}`)
  },
  create (credentials) {
    return Api().post('save', credentials)
  },
  delete (id) {
    return Api().delete(`save/${id}`)
  }
}
