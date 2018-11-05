import Api from './Api'

export default {
  index () {
    return Api().get('tags')
  },
  update (slug, credentials) {
    return Api().put(`tag/${slug}`, credentials)
  },
  show (slug) {
    return Api().get(`tag/${slug}`)
  },
  create (credentials) {
    return Api().post('tag', credentials)
  }
}
