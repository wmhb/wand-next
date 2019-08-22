<template>
  <layout name="LayoutWand">
    <div class="page-wrapper next-wrapper bg-heavenblue">
      <div v-if="nextEvent" class="next">
        <div class="lead">save the date</div>
        <FitText class="date month" v-if="nextEvent.date">{{nextEvent.date}}</FitText>
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
import FitText from '../components/FitText.vue'

export default {
  name: 'Next',
  components: {
    Layout,
    FitText
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
  methods: {
    ...mapActions([
      'getNextEvent'
    ])
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
  width: 80vw;
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
  font-weight: 700;
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
