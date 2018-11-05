import Api from './Api'

export default {
  index (type, id) {
    return Api().get(`subscriptions/${type}/${id}`)
  },
  create (credentials) {
    return Api().post(`subscription`, credentials)
  },
  delete (id) {
    return Api().delete(`subscription/${id}`)
  }
}
