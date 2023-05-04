import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'

const state = {
  alerts: [],
}

const namespaced = true

export const alerts = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
}
