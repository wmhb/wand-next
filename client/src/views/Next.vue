<template>
  <layout name="LayoutWand">
    <div class="page-wrapper next-wrapper bg-heavenblue">
      <div v-if="nextEvent" class="next">
        <div class="lead">save the date</div>
        <div class="date"><span>{{nextEvent.date}}</span></div>
         <div class="year">{{nextEvent.dateYear}}</div>
        <div class="beginn">{{nextEvent.beginn}} @ Karton</div>
      </div>
      <div v-if="!nextEvent" class="next">
        <div class="lead">#wmhb will return in</div>
        <div class="year">{{new Date().getFullYear() +1}}</div>
        <div class="beginn">see you space cowboy...</div>
      </div>
    </div>
  </layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Layout from '../lib/Layout'

export default {
  name: 'Next',
  components: {
    Layout
  },
  data() {
    return {
      errors: ''
    }
  },
  created() {
    this.$store.dispatch('set_logo_state', false)
    this.getNextEvent()
  },
  mounted() {
    let timer

    window.clearTimeout(timer)
    timer = setTimeout(() => {
      this.calcFit('date')
    }, 250)
  },
  methods: {
    ...mapActions([
      'getNextEvent'
    ]),
    calcFit(className) {
      const parent = document.getElementsByClassName('next')[0]
      const element = document.querySelectorAll(`.${className} span`)[0]

      element.style.display = 'inline-block'
      element.style.lineHeight = '1px'

      // then keep trying untill it fits
      let fontSize = 15
      const stepSize = 0.25
      element.style.fontSize = `${fontSize}vmin`

      while (
        element.offsetWidth <= parent.offsetWidth &&
        fontSize < 40
      ) {
        fontSize += stepSize
        element.style.fontSize = `${fontSize}vmin`
      }

      element.style.fontSize = `${fontSize}vmin`

      element.style.display = null
      element.style.lineHeight = null
      parent.style.opacity = 1
    }
  },
  computed: {
    ...mapGetters([
      'nextEvent'
    ])
  },
  sockets: {}
}
</script>

<style lang="scss" scoped>
@import '../scss/vars';
.next-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.next {
  max-width: 75vw;
  font-weight: 700;
  opacity: 0;
  transition: opacity 500ms linear;
}

.date,
.year {
  line-height: .8;
}

.lead {
  font-size: 6.5vmin;
}
.date {
  color: $fatyellow;
}
.year {
    color: $white;
    font-size: 34vmin;
}
.beginn {
  text-align: right;
  font-size: 5vmin;
  color: $blue;
}
</style>

