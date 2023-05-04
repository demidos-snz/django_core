import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'

const state = {
  dataLoaded: false,
  releaseVersion: null,
}

const namespaced = true

export const ui = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
}
