<template>
  <v-snackbar v-model="$store.state.alert" :timeout="10000" :color="type">
    {{ text }}
    <v-btn color="white" flat @click="$store.dispatch('setAlert', false)">
      <v-icon>clear</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'Alert',
  computed: {
    type: function () {
      return this.$store.state.alert.type
    },
    text: function () {
      return this.$store.state.alert.text
    }
  }
}
</script>
