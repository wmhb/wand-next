<template>
<div class="layoutWand">
  <header>
    <LogoSmall class="logo" :class="{ 'inverted': isLogoInverted }"/>
  </header>
<main>
  <transition name="slide-v">
    <keep-alive include="tweets">
      <slot/>
    </keep-alive>
  </transition>
</main>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import audio from '../lib/audio'

import LogoSmall from '../assets/logo-small.svg'

export default {
  name: 'Wand',
  components: {
    LogoSmall
  },
  data() {
    return {
      tweets: []
    }
  },
  mounted() {
    this.initAudio()
  },

  methods: {
    initAudio() {
      audio.music.init()
      audio.music.getTrackInfo(this.soundcloud.url, this.soundcloud.isPlaying)
      this.$store.dispatch('getSoundcloudData')
    },
    gotoSlide() {
      if (this.$router.currentRoute.path !== `/${this.slides.active}`) {
        this.$router.push({ path: `/${this.slides.active}` })
      }
    }
  },
  created() {
    this.$store.dispatch('getSoundcloudData')
  },
  computed: {
    ...mapGetters({
      soundcloud: 'soundcloud',
      slides: 'slides',
      isLogoInverted: 'isLogoInverted'
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
    soundcloud: 'initAudio',
    'slides.active': 'gotoSlide'
  }
}
</script>

<style lang="scss">
@import '../scss/vars';
.logo {
  fill: $white;
  position: absolute;
  height: 3.5vw;
  top: 1vw;
  left: 1vw;
  z-index: 10;

  transition: width $transition-short-duration $ease-cb,
              fill $transition-short-duration linear ($transition-duration / 2);

  &.inverted {
    fill: $black;
  }
}
</style>
