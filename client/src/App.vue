<template>
  <div id="app">
    <component :is="layout">
      <router-view :layout.sync="layout"/>
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
  }
}
</script>

