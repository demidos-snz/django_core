import Vue from 'vue'

export const mutations = {
  SET_DATA_LOADED(state) {
    Vue.set(state, 'dataLoaded', true)
  },

  SET_RELEASE_VERSION(state, releaseVersion) {
    Vue.set(state, 'releaseVersion', releaseVersion)
  },

  RESET(state) {
    Vue.set(state, 'dataLoaded', false)
  },
}
