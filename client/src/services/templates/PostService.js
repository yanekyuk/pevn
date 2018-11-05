import Api from './Api'

export default {
  index (params) {
    const {special, community, user, tag, sort, days, page} = params
    var request = `/posts?sort=${sort}${page ? '&page=' + page : '&page=0'}${community ? '&community=' + community : ''}${user ? '&user=' + user : ''}${tag ? '&tag=' + tag : ''}${days ? '&days=' + days : ''}${special ? '&special=true' : ''}`
    console.log(request)
    return Api().get(request)
  },
  show (id) {
    return Api().get(`post/${id}`)
  },
  url (id) {
    return Api().get(`post/${id}/url`)
  },
  create (credentials) {
    return Api().post(`post`, credentials)
  },
  update (id, credentials) {
    return Api().put(`post/${id}`, credentials)
  },
  delete (id) {
    return Api().delete(`post/${id}`)
  },
  restore (id) {
    return Api().put(`/post/restore/${id}`)
  }
}
