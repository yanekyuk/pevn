import Api from './Api'

export default {
  index () {
    return Api().get('chats')
  },
  check () {
    return Api().get('chats/unread')
  },
  create (credentials) {
    return Api().post('chat', credentials)
  },
  exit (id) {
    return Api().patch(`chat/${id}`)
  },
  delete (id) {
    return Api().delete(`chat/${id}`)
  }
}
