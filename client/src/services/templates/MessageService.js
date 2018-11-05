import Api from './Api'

export default {
  index (id) {
    return Api().get(`chat/${id}`)
  },
  create (id, credentials) {
    return Api().post(`chat/${id}`, credentials)
  }
  // delete (id) {
  //   return Api().delete(`chat/${id}`)
  // }
}
