<template>
  <layout name="LayoutWand">
    <div class="page-wrapper supporter-wrapper bg-lightgrey">
      <div class="supporter" :class="{ 'load': loaded }">
        <bdmLogo class="bremendigitalmedia"/>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from '../lib/Layout'
import bdmLogo from '../assets/bremendigitalmedia.svg'

let timer

export default {
  name: 'Supporter',
  components: {
    Layout,
    bdmLogo
  },
  mounted() {
    this.$store.dispatch('set_logo_state', true)
  },
  data() {
    return {
      loaded: false
    }
  },
  created() {
    window.clearTimeout(timer)
    timer = setTimeout(() => {
      this.loaded = true
    }, 300)
  },
  methods: {},
  sockets: {}
}
</script>

<style lang="scss" scoped>
@import '../scss/vars';
.supporter-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.supporter {
  width: 80vw;
  opacity: 0;
  transform: translate3d(0, 5vw, 0);
  transition: transform 1s $ease-cb, opacity 1s linear 250ms;
  &.load {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.bremendigitalmedia {
  width: 100%;
}
</style>
