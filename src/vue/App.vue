<template>
  <div id="app">
    <component :is="layout">
      <router-view :layout.sync="layout" v-if="loaded"/>
    </component>
  </div>
</template>

<style lang="scss">
@import './scss/vars';
@import './scss/base';
@import './scss/transitions';
</style>

<script>
import Axios from 'axios'
import Store from './store'
import Router from './router'

export default {
  name: 'App',
  data() {
    return {
      loaded: false,
      layout: 'div'
    }
  },
  created: () => {
    // Add a response interceptor
    Axios.interceptors.response.use(response => response, (error) => {
      const originalRequest = error.config
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        Store.dispatch('auth_logout').then(() => {
          Router.push('/login')
        })
      }
      // Do something with response error
      return Promise.reject(error.response)
    })

    // Add a request interceptor
    Axios.interceptors.request.use((config) => {
      // Do something before request is sent
      Store.dispatch('auth_inspectToken')
      return config
    }, error => Promise.reject(error))
  },
  sockets: {
    initialize(data) {
      this.loaded = true
      Store.dispatch('setConfig', { ...data.config })
      Store.dispatch('setInitialTweets', data.tweets)
      Store.dispatch('admin_stateChange', data.state)
    },
    stateChange(changedState) {
      this.$store.dispatch('admin_stateChange', changedState)
    }
  }
}
</script>
