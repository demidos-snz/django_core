import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'

const state = {
  socketStatus: 'closed',
}

const namespaced = true

export const socket = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
}
