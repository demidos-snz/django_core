import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'

const state = {
  events: [],
  selectedSensorId: null,
  selectedSiemId: null,
  packUuid: null,
  totalItems: 0,
  page: 1,
  perPage: 15,
  loading: false,
}

const namespaced = true

export const events = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
}
