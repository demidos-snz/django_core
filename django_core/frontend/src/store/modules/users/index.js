import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'
import { ACTIVENESS_TYPE } from '@/constants/enums'

const namespaced = true
const state = {
  users: [],
  selectedUserId: null,
  activenessFilter: [ACTIVENESS_TYPE.ACTIVE],
  filters: {
    roles: [0, 1, 2, 3, 4, 5],
  },
}
export const users = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
}
