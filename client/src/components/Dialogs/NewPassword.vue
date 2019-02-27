<template>
  <v-dialog v-model="$store.state.dialogs.auth.newPassword" persistent max-width="600px" :fullscreen="$store.state.mobile">
      <v-card>
        <v-btn small :class="{ error : $store.state.settings.dark }" dark right absolute @click.native="$store.dispatch('toggleNewPasswordDialog')"><v-icon>clear</v-icon></v-btn>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <span class="grey--text darken-2">
                  Yeni parolanızı girin.
                </span> <br>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Parola" type="password" name="password" v-model="password" :rules="$store.state.dialogs.auth.register ? [rules.required, rules.minLength8, rules.maxLength32] : []" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Doğrula" type="password" name="password_confirm" v-model="passwordConfirm" :rules="$store.state.dialogs.auth.register ? [rules.required, rules.confirm] : []" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-btn :disabled="!formIsValid || $store.state.loading" right absolute small class="primary" @click="setPassword">gönder</v-btn>
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
      password: '',
      passwordConfirm: '',
      rules: {
        required: value => !!value || 'Zorunlu!',
        minLength8: value => value.length > 7 || 'En az 8 karakter.',
        maxLength32: value => value.length < 33 || 'En fazla 32 karakter.',
        confirm: value => value === this.password || 'Parolalar uyuşmuyor.'
      },
      loading: false
    }
  },
  computed: {
    formIsValid () {
      return (
        this.password && this.passwordConfirm
      )
    }
  },
  methods: {
    async setPassword () {
      await AuthService.setPassword({
        password: this.password,
        token: this.$route.params.token
      }).then(response => {
        this.$store.dispatch('setAlert', { type: 'success', text: 'Parolanız başarıyla değiştirildi.' })
        this.$store.dispatch('toggleNewPasswordDialog')
      }).catch(error => {
        this.$store.dispatch('setAlert', { type: 'error', text: 'Parola değiştirme başarısız.', error: error })
      })
    }
  }
}
</script>
