import Vue from 'vue'
import Axios from 'axios'
import VueSocketIO from 'vue-socket.io'

import App from './vue/App.vue'
import Router from './vue/router'
import Store from './vue/store'
import Auth from './vue/lib/auth'

const token = localStorage.getItem('user-token')
if (token) {
  Axios.defaults.headers.common.Authorization = Auth.getAuthHeader()
}

Vue.config.productionTip = true
Vue.use(new VueSocketIO({
  debug: true,
  connection: `${window.location.origin}`
}))

new Vue({
  router: Router,
  store: Store,
  render: h => h(App)
}).$mount('#app')
