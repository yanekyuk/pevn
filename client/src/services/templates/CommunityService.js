import Api from './Api'

export default {
  index () {
    return Api().get('communities')
  },
  show (slug) {
    return Api().get(`community/${slug}`)
  },
  create (credentials) {
    return Api().post(`community`, credentials)
  },
  update (slug, credentials) {
    return Api().put(`community/${slug}`, credentials)
  },
  settings (slug, credentials) {
    return Api().put(`/community/${slug}/settings`, credentials)
  },
  delete (id) {
    return Api().delete(`community/${id}`)
  }
}
