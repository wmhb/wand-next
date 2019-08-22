<template>
  <span class="fit"><slot></slot></span>
</template>

<script>
import fitty from 'fitty'
import { setTimeout } from 'timers'

export default {
  name: 'FitText',
  props: {
    options: {
      type: Object,
      required: false,
      default() {
        return {
          minSize: 40,
          maxSize: 700,
          multiLine: false
        }
      }
    }
  },
  data() {
    return {
      $_fitty: undefined
    }
  },
  destroyed() {
    this.$_fitty.unsubscribe()
  },
  mounted() {
    setTimeout(() => {
      this.$_fitty = fitty(this.$el, this.options)
    }, 100)
  }
}
</script>

<style scoped>
  .fit {
    display: inline-block;
    white-space: nowrap;
  }
</style>
