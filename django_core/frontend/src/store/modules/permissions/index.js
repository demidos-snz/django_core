import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'

const state = {
  roleModel: [],
}

const namespaced = true

export const permissions = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
}
