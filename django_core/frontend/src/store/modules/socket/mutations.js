import Vue from 'vue'

export const mutations = {
  SOCKET_OPENED(state) {
    Vue.set(state, 'socketStatus', 'opened')
  },

  SOCKET_CLOSED(state) {
    Vue.set(state, 'socketStatus', 'closed')
  },

  SOCKET_RECONNECTION(state) {
    Vue.set(state, 'socketStatus', 'reconnection')
  },

  RESET(state) {
    Vue.set(state, 'socketStatus', 'closed')
  },
}
