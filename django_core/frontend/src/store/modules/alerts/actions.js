import Alert from '@/store/models/alert'

export const actions = {
  addAlert({ commit }, alertData) {
    const alert = new Alert(alertData)
    alert.start()

    commit('ADD_ALERT', alert)
  },
  deleteAlert({ commit }, alertId) {
    commit('DELETE_ALERT', alertId)
  },
}
