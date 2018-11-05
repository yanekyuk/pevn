import Api from './Api'

export default {
  index (slug) {
    return Api().get(`community/${slug}/moderators`)
  },
  create (slug, credentials) {
    return Api().post(`community/${slug}`, credentials)
  },
  delete (slug, id) {
    return Api().delete(`community/${slug}/moderator/${id}`)
  }
}
