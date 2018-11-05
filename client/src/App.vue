<template>
  <v-app :dark="$store.state.settings.dark > 0">
    
    <!-- TOP -->
    <v-progress-linear class="my-0" height="3" :indeterminate="$store.state.loading" v-model="progress"></v-progress-linear>
    
    <!-- DIALOGS -->
    <register-dialog v-if="dialogs.auth.register" />
    <login-dialog v-if="dialogs.auth.login" />
    <new-password-dialog v-if="dialogs.auth.newPassword" />
    <account-settings-dialog v-if="dialogs.auth.settings" />
    <alert v-if="$store.state.alert"/>
    
    <!-- LANDING -->
    <v-container  fluid :grid-list-lg="!$store.state.mobile" :grid-list-xs="$store.state.mobile"
                  class="pt-2" :class="$store.state.mobile ? 'px-0' : ''">
      <v-layout row wrap>
        <!-- LEFT -->
        <v-flex xs12 md6 v-if="!$store.state.mobile">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti voluptates alias sunt minima commodi animi placeat facere doloremque reprehenderit officia esse, quidem fuga. Libero, quaerat alias eos dolorum repellat quisquam.
        </v-flex>
        <!-- RIGHT -->
        <v-flex xs12 md6>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod fugit temporibus possimus, ex maxime dicta obcaecati expedita? Quasi ipsam quibusdam, a sunt placeat commodi quia magni officia nulla minus beatae!
        </v-flex>
      </v-layout>
      <!-- SCROLL TO TOP -->
      <v-btn  fixed bottom right fab class="primary mr-1" :disabled="$store.state.searching"
              small @click="startScrollToTop" :loading="$store.state.loading"><v-icon>keyboard_arrow_up</v-icon></v-btn>
    </v-container>
  </v-app>
</template>

<script>
import Alert from '@/components/dialogs/Alert.vue'
import AuthService from './services/AuthService.js'

import {LoginDialog, RegisterDialog, NewPasswordDialog, AccountSettingsDialog} from '@/components/Dialogs'
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    Alert, LoginDialog, RegisterDialog, NewPasswordDialog, AccountSettingsDialog
  },
  data () {
    return {
      progress: 100
    }
  },
  computed: {
    ...mapGetters({
      auth: 'getAuth',
      token: 'getToken',
      dialogs: 'getDialogs',
      page: 'getPage',
      settings: 'getSettings',
      params: 'getParams'
    })
  },
  watch: {
    async '$route' (to, from) {
      this.getPosts()
    },
    token: async function (val) {
      if (val) {
        this.verifyAuth().then(() => {
          this.$store.dispatch('setAlert', { type: 'success', text: `Hoşgeldin ${this.auth.username}` })
        }).catch(error => {
          this.$store.dispatch('setAlert', { type: 'error', text: 'Giriş yapılamadı!' })
        })
      } else {
        this.$store.dispatch('setAlert', { type: 'success', text: 'Çıkış yapıldı!' })
      }
    }
  },
  methods: {
    async verifyAuth () {
      await AuthService.verify().then(async auth => {
          this.$store.dispatch('setSettings', {
            dark: auth.data.settings.dark,
            nsfw: auth.data.settings.nsfw,
            spoiler: auth.data.settings.spoiler,
            colorization: auth.data.settings.colorization
          })
          await this.calculateScore(auth.data).then(response => {
            var result = Object.assign(auth.data, response)
            this.$store.dispatch('setAuth', result)
          })
      }).catch(error => {
        localStorage.clear()
        this.$store.dispatch('setAlert', { type: 'error', text: 'Bir sorun oldu. Yeniden giriş yapmanız gerekmektedir.' })
      })
    },
    async onResize () {
      this.$store.dispatch('setMobile', window.innerWidth < 768)
    },
    timeoutForScroll (operator, val) {
      var timeOut
      if (operator) {
        timeOut = setTimeout(() => { this.scrollToTop() }, val)
      } else {
        clearTimeout(timeOut)
      }
    },
    startScrollToTop() {
      this.scrollToTop()
    },
    scrollToTop () {
      var val = document.body.scrollTop || document.documentElement.scrollTop
      if (val > 1) {
        window.scrollBy(0, -Math.sqrt(val * .125) * 3)
        this.timeoutForScroll(true, 10)
        this.$store.dispatch('setLoading', true)
      } else {
        this.$store.dispatch('setPosts', null)
        this.$store.dispatch('setPage', 0)
        this.getPosts()
        window.scrollBy(0, -1)
        this.$store.dispatch('setLoading', false)
        this.timeoutForScroll(false)
      }
    },
  },
  async mounted () {
    // VERIFY LOCAL STORAGE
    if (localStorage.getItem('token')) { this.verifyAuth() }
    if (this.$route.name === 'passwordReset') { this.$store.dispatch('toggleNewPasswordDialog') }
    // CHECK IF IT'S MOBILE
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  async beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  }
}
</script>

<style lang="scss">
#app {
  background: #1d1d1d;
}
</style>
