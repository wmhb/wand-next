import Vue from 'vue'
import Vuex from 'vuex'
import globalModule from './modules/global'
import adminModule from './modules/admin'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    global: globalModule,
    admin: adminModule
  }
})
