<template>
  <layout name="LayoutWand">
    <div class="view-wrapper" v-images-loaded:on.done="loadCallback">
      <div v-for="(talk, idx) in talks" :key="idx">
        <transition name="slide-h">
          <div class="page-wrapper" :class="`bg-${colors[idx]}`" v-if="idx == speaker">
            <div class="content">
              <div class="text-container">
                <div class="name">{{talk.speaker}}</div>
                <div class="title">
                  {{talk.title}}
                </div>
              </div>
              <div class="image-container">
                <div class="inner" v-for="(img, idx) in talk.img" :key="idx">
                  <div class="reveal"></div>
                  <img class="speaker-image" :src="img">
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </layout>
</template>

<script>
import Axios from 'axios'
import imagesLoaded from 'vue-images-loaded'
import anime from 'animejs'
import Layout from '../lib/Layout'

let timer

export default {
  name: 'Speakers',
  components: {
    Layout
  },
  directives: {
    imagesLoaded
  },
  mounted() {},
  data() {
    return {
      talks: [],
      colors: ['flashygreen', 'fatyellow', 'hotpink'],
      imagesLoaded: false,
      animation: null
    }
  },
  created() {
    this.changeLogoBg()
    Axios.get(`${this.$store.getters.config.APISpeakersUrl}`)
      .then(({ data }) => {
        this.talks = data.talks
      })
      .catch((e) => {
        this.errors = e.response
      })
  },
  computed: {
    speaker() {
      return this.$route.params.id
    }
  },
  methods: {
    loadCallback() {
      window.clearTimeout(timer)
      timer = setTimeout(() => {
        this.imagesLoaded = true
        const animation = anime.timeline({
          direction: 'forward',
          duration: 500,
          easing: 'cubicBezier(0.4, 0.0, 0.2, 1)'
        })

        animation
          .add({
            targets: '.reveal',
            scaleY: [0, 1],
            translateZ: 0,
            transformOrigin: ['0% 0%', '0% 0%']
          })
          .add({
            targets: '.speaker-image',
            opacity: [0, 1],
            translateZ: 0,
            duration: 100,
            offset: '-=100'
          })
          .add({
            targets: '.reveal',
            translateY: ['0%', '100%'],
            translateZ: 0,
            offset: '-=50'
          })
      }, 300)
    },
    changeLogoBg() {
      if (this.speaker === '1') {
        this.$store.dispatch('set_logo_state', true)
      } else {
        this.$store.dispatch('set_logo_state', false)
      }
    }
  },
  sockets: {},
  watch: {
    speaker: 'changeLogoBg'
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/vars';
.content {
  display: flex;
  align-items: stretch;
  height: 100%;
  flex-direction: column;

  @media screen and (min-width: $screen-md) {
    flex-direction: row;
  }
}

.text-container {
  flex: 2;
  display: flex;
  justify-content: center;
  flex-direction: column;
  z-index: 2;
  transform: translate(5vw, 0);
  font-size: 5vw;
}

.title {
  letter-spacing: -.01em;
  font-size: 1em;
  font-weight: 600;
  line-height: 1.1;
  width: calc(100% - 2em);
  margin-top: .5em;
}
.name {
  font-size: .75em;
  letter-spacing: -.015em;
  line-height: 1.1;
  color: $white;
}

.image-container {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  @media screen and (min-width: $screen-md) {
    flex-direction: column;
  }
}

.inner {
  flex: 1;
  overflow:hidden;
  position: relative;
}

.reveal {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  backface-visibility: hidden;
  transform-origin: 0% 0%;
  transform: scaleY(0);
  z-index: 1;
}

.speaker-image {
  object-fit: cover;
  mix-blend-mode: overlay;
  filter: saturate(0);
  height: 100%;
  width: 100%;
  opacity: 0;
}
</style>
