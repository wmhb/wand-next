<template>
  <layout name="LayoutAdmin">
    <div class="page-wrapper admin-wrapper bg-lightgrey">
      <div class="logout-container">
        <a @click="logout()">Logout</a>
      </div>

      <section class="bg-white">
        <h2>Slides</h2>
        <div class="btn-grid">
          <button v-for="slide in slides.available"
                  :key="slide"
                  class="btn"
                  @click.prevent="gotoSlide(slide)">{{slide}}</button>
        </div>
      </section>

      <section class="bg-heavenblue">
        <h2>Actions</h2>
        <div class="btn-grid">
          <button class="btn" @click.prevent="toggleSlideAutoplay()">
            Autoplay
            <span v-if="!slides.isAutoplay">starten</span>
            <span v-if="slides.isAutoplay">stoppen</span>
          </button>
          <button class="btn" @click.prevent="playGong()">Gong</button>
        </div>
      </section>

      <section class="bg-flashygreen">
      <h2>Speakers</h2>
        <a class="speaker" v-for="(talk, index) in talks"
           :key="talk.speaker"
          @click.prevent="gotoSlide(`speakers/${index}`)">
          <img v-if="talk.img" width="100" height="100" :src="talk.img[0]">
          <div class="text">
            <span class="name">{{talk.speaker}}</span>
            <span class="title">{{talk.title}}</span>
          </div>
        </a>
      </section>

      <section class="bg-fatyellow">
        <h2>Twitter</h2>
        <div class="field-group">
          <input type="text" placeholder="hashtag" v-model="twitter.hashtag">
          <button class="btn" @click="setHashtag()">Set HT</button>
        </div>
        <button class="btn btn-block" @click="toggleStreaming()">
          <span v-if="!twitter.isStreaming">Start Streaming</span>
          <span v-if="twitter.isStreaming">Pause Streaming</span>
        </button>
      </section>

      <section class="bg-smoothviolet">
        <h2>Audio</h2>
        <div class="artwork" @click="toggleSoundcloud()">
          <div class="play-state">
            <span v-if="!soundcloud.isPlaying">▶</span>
            <span v-if="soundcloud.isPlaying">❚❚</span>
          </div>
          <img v-if="soundcloud.data.artwork_url"
               :src="soundcloud.data.artwork_url">
        </div>
        <h3 class="artist">{{soundcloud.data.artist}}</h3>
        <h4 class="title">{{soundcloud.data.title}}</h4>
        <div class="field-group">
          <input type="text" placeholder="soundcloud url" v-model="soundcloud.url">
          <button class="btn" @click="setSoundcloudUrl()">Set Url</button>
        </div>
      </section>

    </div>
  </layout>
</template>

<script>
import Axios from 'axios'
import { mapGetters } from 'vuex'
import Layout from '../lib/Layout'

export default {
  name: 'admin',
  components: {
    Layout
  },
  mounted() {
    this.$store.dispatch('admin_getState')
  },
  created() {
    Axios.get(`${this.$store.getters.config.APIAuthBasePath}/check`)
      .catch(() => {
      })
    Axios.get(`${this.$store.getters.config.APISpeakersUrl}`)
      .then(({ data }) => {
        this.talks = data.talks
      })
      .catch((e) => {
        this.errors = e.response
      })
  },
  data() {
    return {
      talks: []
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth_logout').then(() => {
        this.$router.push('/login')
      })
    },
    gotoSlide(slide) {
      this.$store.dispatch('admin_setSlide', slide)
    },
    toggleSlideAutoplay() {
      this.$store.dispatch('admin_setSlideAutoplay')
    },
    toggleStreaming() {
      this.$store.dispatch('admin_toggleStreaming')
    },
    setHashtag() {
      this.$store.dispatch('admin_setHashtag', { hashtag: this.twitter.hashtag })
    },
    playGong() {
      this.$store.dispatch('admin_play_gong')
    },
    toggleSoundcloud() {
      this.$store.dispatch('admin_toggle_sc')
    },
    setSoundcloudUrl() {
      this.$store.dispatch('admin_setUrl_sc', { url: this.soundcloud.url })
    }
  },
  computed: {
    ...mapGetters({
      twitter: 'twitter',
      soundcloud: 'soundcloud',
      slides: 'slides'
    })
  },
  sockets: {
    stateChange(changedState) {
      this.$store.dispatch('admin_stateChange', changedState)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/scss/vars';
@import 'src/scss/mixins';

.admin-wrapper {
  display: block;
  @include mq('md') {
    display: grid;
    grid-template-columns: repeat(2, minmax(8rem, 1fr));
    grid-gap: 1.5em;
  }

  @include mq('lg') {
    grid-template-columns: repeat(3, minmax(8rem, 1fr));
  }
}

section {
  width: 100%;
  padding: 0 2vw 2vw;
  margin-bottom: 2vw;
  @include box-shadow('large');

  @include mq('md') {
    margin-bottom: 0;
  }
}

$colors-names: smoothviolet fatyellow flashygreen heavenblue;
$colors-list: $smoothviolet $fatyellow $flashygreen $heavenblue;
@each $current-color in $colors-list {
  $i: index($colors-list, $current-color);
  $name: nth($colors-names, $i);
  .bg-#{$name} {
    @if $name == 'smoothviolet' or $name == 'flashygreen' or $name == 'heavenblue' {
      color: $white;
    }
    .btn {
      background-color: darken($current-color, 20%);
    }
  }
}

h2 {
  margin: 0;
  padding: 6vw 0;
  line-height: 1;

  @include mq('sm') {
    padding: 3vw 0;
  }
}

a,
.btn,
.speaker {
  cursor: pointer;
}

a,
button {
  @include transitionScaleOnHover();
}

input {
  border: 0;
  font-size: 1.25em;
  padding: .5em;
  max-width: 65%;
}

input[type=text], textarea {
  transition: box-shadow $transition-short-duration $ease--smooth-fade;
  outline: none;
}

input[type=text]:focus, textarea:focus {
  box-shadow: inset 0 0 0px 2px rgba(0, 0, 0, 0.15)
}

.field-group {
  display: flex;
  margin-bottom: 2vw;

  input {
    flex: 1;
  }
}

.speaker {
  color: $black;
  display: flex;
  align-items: center;
  margin-bottom: 2vw;
  background-color: $white;
  box-shadow: 0px 10px 32.98px 1.02px rgba(0, 0, 0, 0.15),
              0px 0px 3px 0px rgba(0, 0, 0, 0.05),
              0px 0px 0px 0px rgba(0, 0, 0, 0.15);
  @include transitionScaleOnHover();

  img {
    flex: 1;
    display: block;
    object-fit: cover;
  }

  .text {
    flex: 2;
    @include lhCrop(1.2, .75);
    padding: 0 2vw;
  }

  .name,
  .title {
    display: block;
  }

  .name {
    font-weight: 700;
  }

  .title {
    font-size: .75em;
  }
}

.artwork {
  cursor: pointer;
  position: relative;

  @include transitionScaleOnHover();
  @include gradientOverlay('light');

  img {
    width: 100%;
    height: auto;
  }
}

.play-state {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 20vw;
  transform: translate(-50%,-50%);
  text-shadow: 0 14px 24px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.09);
  z-index: 10;

  @include mq('sm') {
    font-size: 15vw;
  }

  @include mq('md') {
    font-size: 10vw;
  }
}

.artist {
  font-size: 2em;
  line-height: 1;
}

.title {
  margin-top: 0;
  font-size: 1.25em;
}

.logout-container {
  height: 12vw;
  position: absolute;
  top: 0;
  right: 2vw;
  display: flex;
  justify-content: center;
  align-items: center;

  @include mq('sm') {
    height: 9vw;
  }

  a {
    display: inline-block;
    font-size: 1em;
    font-weight: 700;
    border-bottom: 2px solid $hotpink;

    @include mq('sm') {
      font-size: 1.25em;
    }
  }
}

.btn {
  padding: 1em;
}

.btn-block {
  width: 100%;
}

//  Based on https://medium.com/cloudaper/how-to-create-a-flexible-square-grid-with-css-grid-layout-ea48baf038f3
.btn-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  grid-auto-rows: 1fr;
  grid-gap: .5em;
}

.btn-grid::before {
  content: '';
  width: 0;
  padding-bottom: 100%;
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}

.btn-grid > *:first-child {
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}
</style>
