import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home'
    },
    {
      path: '/p/:id',
      name: 'samplepage'
    },
    {
      path: '/t/:slug',
      name: 'sampleproduct'
    },
    {
      path: `/p/:token`,
      name: 'passwordReset'
    },
  ]
})
