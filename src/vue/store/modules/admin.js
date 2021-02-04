import Axios from 'axios'

const state = {
  twitter: {
    isStreaming: null,
    hashtag: ''
  },
  slides: {
    isAutoplay: false,
    active: '',
    available: []
  }
}

const mutations = {
  ADMIN_STATE_CHANGED(state, changedState) {
    Object.assign(state, changedState)
  }
}

const actions = {
  admin_stateChange({ commit }, state) {
    commit('ADMIN_STATE_CHANGED', state)
    if ('isPlaying' in state.soundcloud) {
      commit('SET_SC', { key: 'isPlaying', val: state.soundcloud.isPlaying })
    }
    if ('data' in state.soundcloud) {
      commit('SET_SC', { key: 'data', val: state.soundcloud.data })
    }
    if ('url' in state.soundcloud) {
      commit('SET_SC', { key: 'url', val: state.soundcloud.url })
    }
  },
  admin_setSlide(context, slide) {
    Axios.post(`${this.getters.config.APIAuthBasePath}/slide`, { active: slide })
  },
  admin_setSlideAutoplay() {
    Axios.get(`${this.getters.config.APIAuthBasePath}/slide/autoplay`)
  },
  admin_toggleStreaming() {
    Axios.get(`${this.getters.config.APIAuthBasePath}/twitter/toggle`)
  },
  admin_setHashtag(context, data) {
    Axios.post(`${this.getters.config.APIAuthBasePath}/twitter/hashtag`, data)
  },
  admin_play_gong() {
    Axios.get(`${this.getters.config.APIAuthBasePath}/audio/gong`)
  },
  admin_toggle_sc() {
    Axios.get(`${this.getters.config.APIAuthBasePath}/audio/music/toggle`)
  },
  admin_setUrl_sc(context, url) {
    Axios.post(`${this.getters.config.APIAuthBasePath}/audio/music/url`, url)
      .then(() => {})
      .catch(() => {
        context.dispatch('admin_getState')
      })
  }
}

const getters = {
  twitter: (state) => state.twitter,
  slides: (state) => state.slides
}

export default {
  state,
  getters,
  mutations,
  actions
}
