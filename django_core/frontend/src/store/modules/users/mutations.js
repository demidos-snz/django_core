import Vue from 'vue'
import { ACTIVENESS_TYPE } from '@/constants/enums'

export const mutations = {
  SET_USERS(state, users) {
    Vue.set(state, 'users', users)
  },

  ADD_USER(state, user) {
    const index = state.users.findIndex((item) => user.id === item.id)
    if (index >= 0) state.users.splice(index, 1)

    state.users.push(user)
  },

  UPDATE_USER(state, user) {
    const index = state.users.findIndex((item) => user.id === item.id)

    if (index < 0) return
    const storedUser = state.users[index]
    const merged = { ...storedUser, ...user }

    state.users.splice(index, 1)
    state.users.push(merged)
  },

  REMOVE_USER(state, userId) {
    const index = state.users.findIndex((item) => userId === item.id)
    state.users.splice(index, 1)
  },

  SELECT_USER_ID(state, userId) {
    Vue.set(state, 'selectedUserId', userId)
  },

  RESET(state) {
    Vue.set(state, 'users', [])
    Vue.set(state, 'selectedUserId', null)
    Vue.set(state, 'activenessFilter', [ACTIVENESS_TYPE.ACTIVE])
  },

  SET_FILTER(state, filter) {
    Vue.set(state.filters, filter.filterKey, filter.filterValue)
  },

  SET_ACTIVENESS_FILTER(state, filterValue) {
    Vue.set(state, 'activenessFilter', filterValue)
  },

  RESET_FILTERS(state) {
    Vue.set(state, 'filters', {
      roles: [0, 1, 2, 3, 4, 5],
    })
  },
}
