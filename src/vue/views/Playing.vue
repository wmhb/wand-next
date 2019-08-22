<template>
  <layout name="LayoutWand">
    <div class="page-wrapper playing-wrapper bg-smoothviolet">
      <div class="playing">
        <div class="front">
          <img v-if="soundcloud.data.artwork_url" class="artwork" :src="soundcloud.data.artwork_url">
          <div class="meta">
            <div class="now">now playing</div>
            <div class="artist">{{soundcloud.data.artist}}</div>
            <div class="title">{{soundcloud.data.title}}</div>
          </div>
        </div>
        <div class="back">
          <div class="meta">
            <div class="now">now playing</div>
            <div class="artist">{{soundcloud.data.artist}}</div>
            <div class="title">{{soundcloud.data.title}}</div>
          </div>
          <img v-if="soundcloud.data.artwork_url" class="artwork" :src="soundcloud.data.artwork_url">
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Layout from '../lib/Layout'

export default {
  name: 'Playing',
  components: {
    Layout
  },
  created() {
    this.$store.dispatch('set_logo_state', false)
  },
  data() {
    return {
    }
  },
  methods: {},
  sockets: {},
  computed: {
    ...mapGetters({
      soundcloud: 'soundcloud'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/vars';
@import '../scss/mixins';

.playing-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 150vw;
}

.playing {
  width: 90vw;
  position: relative;
  transform-style: preserve-3d;
  animation: flip 20s $ease-cb alternate infinite;
}

@keyframes flip {
  0%, 47.5% {
    transform: rotateY(0deg);
  }
  52.5%, 100%{
    transform: rotateY(180deg);
  }
}

.front,
.back {
  display: flex;
  align-items: flex-end;
  backface-visibility: hidden;
}

.back {
  position: absolute;
  transform: rotateY(180deg);
  top: 0;
  width: 100%;
  height: 100%;
}

.artwork {
  flex: 1;
  width: 100%;
  height: auto;
  box-shadow: 0px 10px 32.98px 1.02px rgba(0, 0, 0, 0.15),
              0px 0px 3px 0px rgba(0, 0, 0, 0.05),
              0px 0px 0px 0px rgba(0, 0, 0, 0.15);
}

.meta {
  flex: 2;
  color: $white;

  .front & {
    padding-left: 3em;
  }

  .back & {
    padding-right: 3em;
    text-align: right;
  }
}

.now {
  color: $black;
  font-size: 3em;
  line-height: 1;
}

.status {
  padding-right: .5em;
}

.artist {
  font-size: 5.5vw;
  line-height: 1;
  letter-spacing: -0.03em;
  font-weight: 700;
  margin: .25em 0;
}

.title {
  color: $fatyellow;
  font-size: 4.5vw;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 700;
}
</style>
