<template>
  <layout name="LayoutWand">
    <div class="page-wrapper tweets-wrapper bg-lightgrey">
      <morph class="diag diag--pink"/>
      <transition-group name="tweet" tag="div" class="tweet__container" v-if="tweets.length">
        <div v-for="(tweet) in tweets" :key="tweet.id" v-bind:class="tweet.class" class="tweet">
          <img v-if="tweet.type === 'photo'"
              class="tweet__photo"
              v-bind:src="tweet.image.url"
              v-bind:alt="tweet.name">
          <video v-if="tweet.type === 'animated_gif'"
                class="tweet__photo"
                v-bind:src="tweet.image.url"
                autoplay
                muted
                loop
                buffered></video>
          <div class="tweet__content">
            <div class="tweet__head">
              <img class="tweet__avatar"
                  v-bind:src="tweet.avatarUrl"
                  v-bind:alt="tweet.name"
                  width="100"
                  height="100">
              <div class="tweet__meta">
                <div class="tweet__user--name">{{tweet.name}}</div>
                <div class="tweet__user--screen">@{{tweet.screen_name}}</div>
              </div>
            </div>
            <div class="tweet__text" v-html="tweet.text"></div>
            <timeago :datetime="tweet.created_at" :auto-update="10"></timeago>
          </div>
        </div>
      </transition-group>
    </div>
  </layout>
</template>

<script>
// import Axios from 'axios'
import Vue from 'vue'
import VueTimeago from 'vue-timeago'
import de from 'date-fns/locale/de'
import Layout from '../lib/Layout'

import morph from '../assets/morph.svg'


Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'de',
  locales: { de }
})
export default {
  name: 'tweets',
  components: {
    Layout,
    morph
  },
  mounted() {
    Vue.set(this, 'tweets', this.$store.state.global.initialTweets)
  },
  data() {
    return {
      tweets: []
    }
  },
  created() {
    this.$store.dispatch('set_logo_state', true)
  },
  methods: {
    add(tweet) {
      const list = [...this.tweets]
      if (list.length > 5) {
        list.pop() // Last one out
      }
      list.unshift(tweet) // New one on top
      Vue.set(this, 'tweets', list)
    },
    changeLogoBg() {
      if (this.$route.name === 'tweets') {
        this.$store.dispatch('set_logo_state', true)
      }
    }
  },
  sockets: {
    tweets(tweets) {
      Vue.set(this, 'tweets', tweets)
    },
    tweet(tweet) {
      this.add(tweet)
    }
  },
  watch: {
    $route: 'changeLogoBg'
  }
}
</script>

<style lang="scss">
@import '../scss/vars';
@import '../scss/mixins';

.diag path {
  d:path('M 0 300 L 640 0 L 640 340 L 0 640 Z');
  animation: morph 40s $ease-cb alternate infinite;
}

@keyframes morph {
  0%, 48.75% {
    d:path('M 0 300 L 640 0 L 640 340 L 0 640 Z');
  }
  51.25%, 100%{
    d:path('M 0 0 L 640 340 L 640 640 L 0 340 Z');
  }
}

.tweets-wrapper {
  height: 100%;
  overflow: hidden;

  @media screen and (min-width: $screen-md) {
    overflow: hidden;
    height: 100vh;
  }
}

.tweet__container {
  width: 100vw;
  min-width: 0; // Disable Autosizing of Grid Items
  min-height: 0; // Disable Autosizing of Grid Items
  padding: 5vw 1em 1em;
  display: grid;
  grid-template: repeat(2, 1fr) / 1fr;
  grid-gap: 1em;
  position: relative;
  font-size: 1.5vh;

  @media screen and (min-width: $screen-sm) {
    grid-template: repeat(3, 1fr) / repeat(2, 1fr);
  }

  @media screen and (min-width: $screen-md) {
    height: 100vh;
    grid-gap: 2em;
    grid-template: repeat(2, 1fr) / repeat(3, 1fr);
  }
}

.tweet {
  overflow: hidden;
  min-width: 0; // Disable Autosizing of Grid Items
  background-color: $white;
  color: $black;
  box-shadow: 0px 10px 32.98px 1.02px rgba(0, 0, 0, 0.15),
              0px 0px 3px 0px rgba(0, 0, 0, 0.05),
              0px 0px 0px 0px rgba(0, 0, 0, 0.15);

  @include mq('md') {
    height: calc(47.5vh - 2.4vw);
  }
}

.tweet--photo {
  position: relative;
  color: $white;

  @include gradientOverlay();
}

.tweet__photo {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tweet__content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2em;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.tweet__head {
  display: flex;
  width: 100%;
  min-height: 5em;
}

.tweet__head > img {
  width: 5em;
  height: 5em;
}

.tweet__meta {
  padding-left: 2em;
  width: calc(100% - 5em);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tweet__meta > * {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}

.tweet__user--name {
  font-size: 2rem;
  line-height: 2.3rem;
}

.tweet__user--screen {
  font-size: 1.5em;
  font-weight: 700;
}

.tweet__text {
  font-size: 2.75em;
  line-height: 1.25;
  padding: 0.75em 0 .5em;
  max-height: calc(100% - 3.85em);
  position: relative;
  -webkit-mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 1) 0.75em
  );
  mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 1) .75em
  );

  @media screen and (min-width: $screen-sm) {
    font-size: 2.5em;
  }

  @media screen and (min-width: $screen-md) {
    font-size: 1.75em;
  }
}

.hashtag {
  font-weight: 700;
}

.mention {
  color: $heavenblue;
}

time {
  font-size: 1.25em;
  font-weight: 800;
  text-align: right;
  text-transform: uppercase;
}

.tweet-move {
  transition: all $ease-cb 400ms;
}

.tweet-enter,
.tweet-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.tweet-enter-to,
.tweet-leave {
  opacity: 1;
  transform: scale(1);
}

.tweet-leave-active,
.tweet-enter-active {
  transition: all 400ms $ease-cb;
}
</style>
