import Axios from 'axios'
import Auth from '@/lib/auth'

const state = {
  token: localStorage.getItem('user-token') || '',
  status: '',
  config: {},
  events: {
    next: {}
  },
  soundcloud: {
    url: '',
    apiKey: '',
    data: [],
    type: '',
    isPlaying: false
  },
  isLogoInverted: false
}

const mutations = {
  SET_CONFIG(state, config) {
    state.config = config
  },
  SET_SC(state, { key, val }) {
    Object.assign(state.soundcloud, {
      [key]: val
    })
  },
  SET_NEXT_EVENT(state, event) {
    state.events.next = event
  },
  AUTH_REQUEST(state) {
    state.status = 'loading'
  },
  AUTH_SUCCESS(state, token) {
    state.status = 'success'
    state.token = token
  },
  AUTH_ERROR(state) {
    state.status = 'error'
  },
  AUTH_LOGOUT(state) {
    state.token = ''
  },
  LOGO_INVERTED_STATE(state, isInvertedState) {
    state.isLogoInverted = isInvertedState
  }
}

const actions = {
  setConfig({ commit }, config) {
    commit('SET_CONFIG', config)
    commit('SET_SC', { key: 'apiKey', val: config.soundcloud.apiKey })
  },
  setSoundcloud({ commit }, { key, val }) {
    commit('SET_SC', { key, val })
  },
  getSoundcloudData({ commit }) {
    Axios.post(`${this.getters.config.APIAuthBasePath}/audio/music/data`)
      .then(({ data }) => {
        commit('SET_SC', { key: 'isPlaying', val: data.isPlaying })
        commit('SET_SC', { key: 'url', val: data.url })
        commit('SET_SC', { key: 'data', val: data.data })
        commit('SET_SC', { key: 'type', val: data.data.kind })
      })
  },
  getNextEvent({ commit }) {
    Axios.get(`${this.getters.config.APINextUrl}`)
      .then(({ data }) => {
        commit('SET_NEXT_EVENT', data)
      })
  },
  auth_request({ commit }, user) {
    return new Promise((resolve, reject) => {
      commit('AUTH_REQUEST')
      Axios({ url: this.getters.config.APILoginUrl, data: user, method: 'POST' })
        .then((resp) => {
          const { token } = resp.data
          localStorage.setItem('user-token', token)
          Axios.defaults.headers.common.Authorization = Auth.getAuthHeader()
          commit('AUTH_SUCCESS', resp)
          resolve(resp)
        })
        .catch((err) => {
          commit('AUTH_ERROR', err)
          localStorage.removeItem('user-token')
          reject(err)
        })
    })
  },
  auth_logout({ commit }) {
    return new Promise((resolve) => {
      commit('AUTH_LOGOUT')
      localStorage.removeItem('user-token') // clear your user's token from localstorage
      // remove the axios default header
      delete Axios.defaults.headers.common.Authorization
      resolve()
    })
  },
  set_logo_state({ commit }, isInvertedState) {
    commit('LOGO_INVERTED_STATE', isInvertedState)
  }
}

const getters = {
  // Basics
  isLogoInverted: state => state.isLogoInverted,
  // Authentication
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
  // Config
  config: state => state.config,
  soundcloud: state => state.soundcloud,
  nextEvent: state => state.events.next
}

export default {
  state,
  getters,
  mutations,
  actions
}
