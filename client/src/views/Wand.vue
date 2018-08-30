<template>
  <div>
    <keep-alive>
      <transition name="slide-v">
        <router-view :key="currentPath"/>
      </transition>
    </keep-alive>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import audio from '../lib/audio'

export default {
  name: 'Wand',
  data() {
    return {
      tweets: []
    }
  },
  methods: {
    initAudio() {
      audio.music.init()
      audio.music.getTrackInfo(this.soundcloud.url, this.soundcloud.isPlaying)
      this.$store.dispatch('getSoundcloudData')
    },
    gotoSlide() {
      this.$router.push({ path: `/${this.slides.active}` })
    }
  },
  created() {
    this.$store.dispatch('getSoundcloudData')
  },
  mounted() {
    this.$store.dispatch('admin_getState')
  },
  computed: {
    ...mapGetters({
      soundcloud: 'soundcloud',
      slides: 'slides'
    }),
    currentPath() {
      const path = this.$route.fullPath
      return path.split('/')[1]
    }
  },
  sockets: {
    audio_gong() {
      audio.gong.play()
    },
    audio_sc_toggle() {
      audio.music.toggle()
    },
    audio_sc_set(track) {
      audio.music.getTrackInfo(track)
    },
    stateChange(changedState) {
      this.$store.dispatch('admin_stateChange', changedState)
    }
  },
  watch: {
    'soundcloud.url': 'initAudio',
    'slides.active': 'gotoSlide'
  }
}
</script>
