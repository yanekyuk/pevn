import Api from './Api'

export default {
  seedAll (amount) {
    return Api().post(`tests/seed?amount=${amount}`)
  }
}
