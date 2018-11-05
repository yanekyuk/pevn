import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {
    // PERMISSIONS
    canCreateAndEditTags: state => {
      if (state.tag && state.auth) {
        return state.auth.role_id >= 1
      } else { return false }
    },
    canCreatePosts: state => {
      return state.auth
    },
    canModerate: state => {
      if (state.community.id && state.auth) {
        return state.auth.role_id >= 1 || state.community.moderators.map(mod => { return mod.id }).indexOf(state.auth.id) !== -1
      } else { return false }
    },
    // STATES
    getAuth: state => state.auth,
    getToken: state => state.token,
    getDialogs: state => state.dialogs,
    getSettings: state => state.settings,
    getCommunity: state => state.community,
    getUser: state => state.user,
    getTag: state => state.tag,
    getPosts: state => state.posts,
    getPost: state => state.post,
    getComments: state => state.comments,
    getComment: state => state.comment,
    getCommenties: state => state.commenties,
    getChats: state => state.chats,
    getChat: state => state.chat,
    getPage: state => state.params.page,
    getAuthRole: state => state.auth ? state.auth.role_id : -1,
    getParams: state => {
      return {
        special: state.params.special,
        community: state.community ? state.community.id : null,
        user: state.user ? state.user.id : null,
        tag: state.tag ? state.tag.slug : null,
        sort: state.params.sort,
        days: state.params.sort === 'top' || state.params.sort === 'hot' ? state.params.days : null,
        page: state.params.page ? state.params.page : 0
      }
    }
  },
  state: {
    auth: null,
    permissions: null,
    token: localStorage.getItem('token') || null,
    settings: {
      dark: false
    },
    dialogs: {
      auth: { login: false, register: false, newPassword: false, settings: false }
    },
    params: {
      sort: 'new',
      days: 1,
      page: 0
    },
    loading: false,
    searching: false,
    alert: null,
    mobile: false
  },
  mutations: {
    // AUTHEMTICATION
    setAuth (state, auth) { state.auth = auth },
    setToken (state, token) { state.token = token },
    logout (state) {
      state.token = null
      state.auth = null
      localStorage.clear()
    },
    setSettings (state, setting) {
      if (typeof setting === 'string') {
        if (setting === 'dark') { state.settings.dark = !state.settings.dark }
      } else {
        state.settings = setting
      }
    },
    setLoading (state, loading) {
      if (state.loading !== loading) { state.loading = loading }
    },
    setSearching (state, searching) {
      state.searching = searching
    },
    setAlert (state, alert) {
      state.alert = alert
    },
    setMobile (state, mobile) {
      state.mobile = mobile
    },
    // DIALOGS
    toggleLoginDialog (state) {
      state.dialogs.auth.register = false
      state.dialogs.auth.login = !state.dialogs.auth.login
    },
    toggleRegisterDialog (state) {
      state.dialogs.auth.login = false
      state.dialogs.auth.register = !state.dialogs.auth.register
    },
    toggleNewPasswordDialog (state) {
      state.dialogs.auth.newPassword = !state.dialogs.auth.newPassword
    },
    toggleAccountSettingsDialog (state) {
      state.dialogs.auth.settings = !state.dialogs.auth.settings
    },
    setSort (state, object) {
      if (state.params.special !== object.special) { state.params.special = object.special }
      if (state.params.sort !== object.sort) { state.params.sort = object.sort }
      if (state.params.days !== object.days) { state.params.days = object.days }
      if (state.params.page > 0) { state.params.page = 0 }
    },
    setPage (state, page) {
      state.params.page = 0
    },
    incrementPage (state) {
      state.params.page += 1
    }
  },
  actions: {
    // AUTHENTICATION
    setAuth ({commit}, auth) { commit('setAuth', auth) },
    setToken ({commit}, token) { commit('setToken', token) },
    logout ({commit}) { commit('logout') },
    setSettings ({commit}, setting) { commit('setSettings', setting) },
    setLoading ({commit}, loading) { if (this.state.loading !== loading) { commit('setLoading', loading) } },
    setSearching ({commit}, searching) { commit('setSearching', searching) },
    setAlert ({commit}, alert) { commit('setAlert', alert) },
    setMobile ({commit}, mobile) { commit('setMobile', mobile) },
    // DIaLOGS
    toggleLoginDialog ({commit}) { commit('toggleLoginDialog') },
    toggleRegisterDialog ({commit}) { commit('toggleRegisterDialog') },
    toggleNewPasswordDialog ({commit}) { commit('toggleNewPasswordDialog') },
    toggleAccountSettingsDialog ({commit}) { commit('toggleAccountSettingsDialog') },
    setSort ({commit}, object) { commit('setSort', object) },
    setPage ({commit}, page) { commit('setPage', page) },
    incrementPage ({commit}) { commit('incrementPage') }
  }
})
