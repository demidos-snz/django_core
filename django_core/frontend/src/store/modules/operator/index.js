import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'

const state = {
  user: null,
  settings: {},
  isLogged: false,
}

const namespaced = true

export const operator = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
}
