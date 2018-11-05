<template>
  <v-dialog v-model="$store.state.dialogs.auth.register" persistent max-width="600px" :fullscreen="$store.state.mobile">
      <v-card>
        <v-btn small :class="{ error : $store.state.settings.dark }" dark right absolute @click.native="$store.dispatch('toggleRegisterDialog')"><v-icon>clear</v-icon></v-btn>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <span class="headline">Hiçerik'e hoşgeldiniz</span> <br>
                <span class="grey--text darken-2">
                  Hiçerik hesabıyla toplulukları ve kullanıcıları takip edebilir; içeriklerini beğenebilir, kaydedebilir ve onlara yorum yapabilirsiniz.
                </span> <br>
                <span class="grey--text darken-1">Zaten kaydolduysanız, <a flat small style="cursor:pointer; font-weight: 600" @click="$store.dispatch('toggleLoginDialog')">giriş yapın.</a></span>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field label="E-Posta" type="email" name="email" v-model="email" :rules="$store.state.dialogs.auth.register ? [rules.required, rules.email] : []" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Kullanıcı Adı" name="username" v-model="username" :rules="$store.state.dialogs.auth.register ? [rules.required, rules.minLength4, rules.maxLength55, rules.username] : []" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Parola" type="password" name="password" v-model="password" :rules="$store.state.dialogs.auth.register ? [rules.required, rules.minLength8, rules.maxLength32] : []" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Doğrula" type="password" name="password_confirm" v-model="passwordConfirm" :rules="$store.state.dialogs.auth.register ? [rules.required, rules.confirm] : []" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
              <v-divider></v-divider>
                <span class="grey--text darken-1">
                  Kaydolarak, 
                  <a flat small style="cursor:pointer; font-weight: 600" @click="$store.dispatch('toggleLoginDialog')">gizlilik ilkesi</a>
                   ve
                  <a flat small style="cursor:pointer; font-weight: 600" @click="$store.dispatch('toggleLoginDialog')">içerik ilkesini</a>
                   okuduğunuzu ve 
                  <a flat small style="cursor:pointer; font-weight: 600" @click="$store.dispatch('toggleLoginDialog')">şartları</a>
                   onayladığınızı belirtmiş olursunuz.
                </span>
              </v-flex>
            </v-layout>
            <v-btn right absolute small :disabled="!formIsValid || $store.state.loading" class="primary" @click="register">Kaydol</v-btn>
          </v-container>
        </v-card-text>
      </v-card></v-dialog>
</template>

<script>
import AuthService from '@/services/AuthService'

export default {
  name: 'RegisterDialog',
  data () {
    return {
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
      rules: {
        required: value => !!value || 'Zorunlu!',
        minLength4: value => value.length >= 4 || 'En az 4 karakter.',
        maxLength55: value => value.length < 55 || 'En fazla 55 karakter.',
        minLength8: value => value.length > 7 || 'En az 8 karakter.',
        maxLength32: value => value.length < 33 || 'En fazla 32 karakter.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Geçersiz e-posta.'
        },
        username: value => {
          const pattern = /^[0-9a-zıöüçşğ]+(?: ?[0-9a-zıöüçşğ]){3,55}$/
          return pattern.test(value) || 'Geçersiz kullanıcı adı. Yalnız küçük harfler, numaralar ve boşluk kullanılabilir.'
        },
        confirm: value => value === this.password || 'Parolalar uyuşmuyor.'
      },
      loading: false
    }
  },
  computed: {
    formIsValid () {
      return (
        this.email && this.username && this.password && this.passwordConfirm
      )
    }
  },
  methods: {
    async register () {
      try {
        const response = await AuthService.register({
          email: this.email,
          username: this.username,
          password: this.password
        })
        console.log(response.data)
        try {
          this.$store.dispatch('setAuth', response.data)
          const login = await AuthService.login({
            email: this.email,
            password: this.password
          })
          this.$store.dispatch('setToken', login.data.token)
          localStorage.setItem('token', login.data.token)
          this.$store.dispatch('setAlert', { type: 'success', text: 'Kayıt başarılı' })
        } catch (err) {
          console.log(err)
          this.$store.dispatch('setAlert', { type: 'error', text: 'Kayıt Başarısız' })
        }
        this.$store.dispatch('toggleRegisterDialog')
      } catch (error) {
        console.log(error)
        this.$store.dispatch('setAlert', { type: 'error', text: 'Kayıt Başarısız' })
      }
    }
  }
}
</script>
