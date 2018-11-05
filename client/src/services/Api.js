import axios from 'axios'
import store from '../store.js'

export default () => {
  var instance = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
      ? 'http://localhost:8082'
      : 'https://url.to.site',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  })
  // LOADING TIMEOUT
  var timeoutID
  // SET LOADING TRUE WHEN REQUEST IS SENT
  instance.interceptors.request.use(function (config) {
    store.dispatch('setLoading', true)
    if (timeoutID) { clearTimeout(timeoutID) }
    return config
  }, function (error) {
    return Promise.reject(error)
  })
  // SET LOADING FALSE WHEN RESPONSE ARRIVED
  instance.interceptors.response.use(function (response) {
    timeoutID = setTimeout(() => { store.dispatch('setLoading', false) }, 2000)
    return response
  }, function (error) {
    store.dispatch('setLoading', false)
    return Promise.reject(error)
  })

  return instance
}
