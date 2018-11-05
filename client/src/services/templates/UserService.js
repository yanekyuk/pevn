import Api from './Api'

export default {
  index () {
    return Api().get('users')
  },
  show (slug) {
    return Api().get(`user/${slug}`)
  },
  posts (id) {
    return Api().get(`user/${id}/posts`)
  },
  comments (id) {
    return Api().get(`user/${id}/comments`)
  },
  likes (id) {
    return Api().get(`user/${id}/likes`)
  },
  saves (id) {
    return Api().get(`user/${id}/saves`)
  },
  subscriptions (id) {
    return Api().get(`user/${id}/subscriptions`)
  },
  communities (id) {
    return Api().get(`user/${id}/communities`)
  }
}
