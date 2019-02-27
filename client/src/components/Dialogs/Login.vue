<template>
  <v-dialog v-model="$store.state.dialogs.auth.login" @keydown.enter="login" @keydown.esc="$store.dispatch('toggleLoginDialog')"
            persistent max-width="600px" :fullscreen="$store.state.mobile">
      <v-card>
        <v-btn small :class="{ error : $store.state.settings.dark }" dark right absolute @click.native="$store.dispatch('toggleLoginDialog')"><v-icon>clear</v-icon></v-btn>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <span class="headline">Giriş Yap</span>
              </v-flex>
              <v-flex xs12 sm12 :md6="!forgot" :md12="forgot">
                <v-text-field label="E-Posta" type="email" name="email" v-model="email" :rules="$store.state.dialogs.auth.login ? [rules.required, rules.email] : []" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6 v-if="!forgot">
                <v-text-field label="Parola" type="password" name="password" :rules="$store.state.dialogs.auth.login ? [rules.required] : []" v-model="password" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <span class="grey--text darken-2">Yeni misiniz? <a @click="$store.dispatch('toggleRegisterDialog')">Kaydolun!</a> | </span>
                <a @click="forgot = true">Parolamı unuttum.</a>
              </v-flex>
            </v-layout>
            <v-btn v-if="!forgot" right absolute :disabled="$store.state.loading" small class="primary" @click="login">Giriş</v-btn>
            <v-btn v-else right absolute :disabled="!formIsValid || $store.state.loading" small class="primary" @click="forgotMyPassword">yeni parola iste</v-btn>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script>
import AuthService from '@/services/AuthService'

export default {
  name: 'LoginDialog',
  data () {
    return {
      forgot: false,
      email: '',
      password: '',
      rules: {
        required: value => !!value || 'Zorunlu!',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Geçersiz e-posta.'
        }
      },
      loading: false
    }
  },
  computed: {
    formIsValid () {
      return (
        this.email && this.password
      )
    }
  },
  methods: {
    async login () {
      try {
        const response = await AuthService.login({
          email: this.email,
          password: this.password
        })
        try {
          this.$store.dispatch('setToken', response.data.token)
          localStorage.setItem('token', response.data.token)
          this.$store.dispatch('toggleLoginDialog')
          if (response.data.enabled) {
            this.$store.dispatch('setAlert', { type: 'success', text: 'Hesap etkinleştirildi.' })
          } else {
            this.$store.dispatch('setAlert', { type: 'success', text: 'Giriş başarılı' })
          }
        } catch (err) {
          console.log(err)
          this.$store.dispatch('toggleLoginDialog')
          localStorage.removeItem('token')
          this.$store.dispatch('setAlert', { type: 'error', text: 'Giriş başarısız' })
        }
      } catch (error) {
        console.log(error)
        this.$store.dispatch('toggleLoginDialog')
        localStorage.removeItem('token')
        this.$store.dispatch('setAlert', { type: 'error', text: 'Giriş başarısız' })
      }
    },
    async forgotMyPassword () {
      await AuthService.forgot({
        email: this.email
      }).then(response => {
        this.$store.dispatch('setAlert', { type: 'success', text: `En kısa zamanda ${this.email} adresine posta gönderilecektir!` })
      }).catch(error => {
        this.$store.dispatch('setAlert', { type: 'error', text: `Bir sorun oldu!` })
        console.log(error)
      })
    }
  }
}
</script>
