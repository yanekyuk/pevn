<template>
  <v-text-field id="toolbar-search"
        hide-details height="36"
        :prepend-icon="append ? '' : 'search'"
        :append-icon="append ? 'search' : ''"
        :placeholder="compiledPlaceholder"
        single-line
        v-model="search"
      />
</template>

<script>
import PostService from '@/services/PostService.js'
import { mapGetters } from 'vuex'
const Fuse = require('fuse.js')

export default {
  name: 'SearchBar',
  props: {
    'append': Boolean
  },
  data () {
    return {
      search: null,
      options: {
        shouldSort: true,
        threshold: 0.2,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'title',
          'body',
          'user.username'
        ]
      },
      list: null,
      result: [],
      fuse: null,
      error: null
    }
  },
  computed: {
    ...mapGetters({
      params: 'getParams',
      community: 'getCommunity',
      user: 'getUser'
    }),
    compiledPlaceholder: function () {
      var title = this.user ? this.user.username : this.community.title
      var thickVowels = 'aıouAIOU'; var thinVowels = 'eiöüEİÖÜ'
      var hardConsonants = 'çfhkpsştÇFHKPSŞT'; var softConsonants = 'bcdgğjlmnrvyzBCDGĞJLMNRVYZ'
      var add = "'"
      for(var j = 1; j <= title.length; j++) {
        if (hardConsonants.indexOf(title.charAt(title.length - j)) !== -1) {
          add += 't'
          j = title.length
        } else if (softConsonants.indexOf(title.charAt(title.length - j)) !== -1) {
          add += 'd'
          j = title.length
        }
      }
      for(var i = 1; i <= title.length; i++) {
        if (thickVowels.indexOf(title.charAt(title.length - i)) !== -1) {
            add += 'a'
            i = title.length
        } else if (thinVowels.indexOf(title.charAt(title.length - i)) !== -1) {
            add += 'e'
            i = title.length
        }
      }
      add.length < 3 ? add = ' denilen yerde' : add = add
      return title + add + ' ara'
    }
  },
  watch: {
    search: async function (val) {
      if (val.length > 3) {
        try {
          this.$store.dispatch('setSearching', true)
          this.$store.dispatch('setSort', 'all')
          this.list = (await PostService.index(this.params)).data
          this.fuse = await new Fuse(this.list, this.options)
          this.result = this.fuse.search(val)
          this.$store.dispatch('setPosts', this.result)
          this.$store.dispatch('setSearching', false)
        } catch (err) {
          this.error = err
        }
      } else if (val.length === 0) {
        try {
          this.$store.dispatch('setSearching', false)
          this.$store.dispatch('setPosts', (await PostService.index(this.params)).data)
        } catch (err) {
          this.error = err
        }
      }
    }
  }
}
</script>
