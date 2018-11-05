<template>
  <v-dialog v-model="$store.state.dialogs.auth.settings" persistent max-width="600px" :fullscreen="$store.state.mobile">
      <v-card>
        <v-btn small :class="{ error : $store.state.settings.dark }" dark right absolute @click.native="$store.dispatch('toggleAccountSettingsDialog')"><v-icon>clear</v-icon></v-btn>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <span class="headline">Hesap Ayarları</span> <br>
                <span class="grey--text darken-1">Zaten kaydolduysanız, <a flat small style="cursor:pointer; font-weight: 600" @click="$store.dispatch('toggleLoginDialog')">giriş yapın.</a></span>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="E-Posta" type="email" name="email" v-model="email" :rules="[rules.email]"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Yeni Parola" type="password" name="new_password" v-model="newPassword" :rules="[rules.minLength8, rules.maxLength32]" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Doğrula" type="password" name="new_password_confirm" v-model="newPasswordConfirm" :rules="[rules.confirm]" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <span class="grey--text darken-1">
                  Kimliğinizin doğrulanması için şu anki parolanızı girmeniz gerekmektedir.
                </span>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Şu Anki Parola" type="password" name="password" v-model="oldPassword" :rules="[rules.required, rules.minLength8, rules.maxLength32]" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-btn right absolute small :disabled="!formIsValid || $store.state.loading" class="primary" @click="register">kaydet</v-btn>
          </v-container>
        </v-card-text>
      </v-card></v-dialog>
</template>

<script>
import AuthService from '@/services/AuthService'

export default {
  name: 'AccountSettingsDialog',
  data () {
    return {
      email: '',
      newPassword: '',
      newPasswordConfirm: '',
      oldPassword: '',
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
        confirm: value => value === this.newPassword || 'Parolalar uyuşmuyor.'
      },
      loading: false
    }
  },
  computed: {
    formIsValid () {
      if (this.newPassword) {
        return ( this.newPasswordConfirm && this.oldPassword )
      } else {
        return ( this.email && this.oldPassword )
      }
    }
  },
  methods: {
    async register () {
      await AuthService.update(this.$store.state.auth.id, {
          email: this.email,
          newPassword: this.newPassword,
          oldPassword: this.oldPassword
      }).then(auth => {
        this.$store.dispatch('setAlert', { type: 'success', text: 'Hesabınız güncellendi.' })
        this.$store.dispatch('toggleAccountSettingsDialog')
      }).catch(error => {
        console.log({ error: error })
        this.$store.dispatch('setAlert', { type: 'error', text: 'Hesabınız güncellenemedi.' })
      })
    }
  }
}
</script>
