import Vue from 'vue'

export const mutations = {
  ADD_ALERT(state, alert) {
    state.alerts.push(alert)
  },

  DELETE_ALERT(state, alertId) {
    const index = state.alerts.findIndex((item) => alertId === item.id)
    if (index >= 0) state.alerts.splice(index, 1)
  },

  RESET(state) {
    Vue.set(state, 'alerts', [])
  },
}
