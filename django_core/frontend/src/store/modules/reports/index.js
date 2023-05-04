import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'

const namespaced = true
const state = {
  reports: [],
  page: 1,
  itemsPerPage: 10,
  isLoading: false,
  totalItems: 0,
  searchText: '',
  sortBy: 'id',
  sortDesc: false,
  filters: {},
}
export const reports = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
}
