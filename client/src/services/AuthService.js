import Api from './Api'

export default {
  index () {
    return Api().get('auths')
  },
  register (credentials) {
    return Api().post('auth/register', credentials)
  },
  update (id, credentials) {
    return Api().put(`auth/${id}/update`, credentials)
  },
  forgot (credentials) {
    return Api().post('auth/forgot', credentials)
  },
  setPassword (credentials) {
    return Api().post('auth/new-password', credentials)
  },
  verify () {
    return Api().get('auth/verify')
  },
  login (credentials) {
    return Api().post('auth/login', credentials)
  },
  settings (id, credentials) {
    return Api().put(`auth/${id}/settings`, credentials)
  }
}
