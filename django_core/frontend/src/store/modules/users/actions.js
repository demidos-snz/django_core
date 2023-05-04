import { createUserItem, updateUserItem, updateUserItemOrganizations } from '@/api/user'

export const actions = {
  setUsers({ commit }, users) {
    commit('SET_USERS', users)
  },

  addUser({ commit }, user) {
    commit('ADD_USER', user)
  },

  updateUser({ commit }, user) {
    commit('UPDATE_USER', user)
  },

  removeUser({ commit }, userId) {
    commit('REMOVE_USER', userId)
  },

  selectUserId({ commit }, userId) {
    commit('SELECT_USER_ID', userId)
  },

  deselectUserId({ commit }) {
    commit('SELECT_USER_ID', null)
  },

  async createUserInstance({ dispatch }, params) {
    const [error, response] = await createUserItem(params)
    if (!error && response.status === 201) {
      dispatch('selectUserId', response.data.id)
    }

    return [error, response]
  },

  async updateUserInstance(context, { id, params }) {
    const [error, response] = await updateUserItem(id, params)
    return [error, response]
  },

  async updateUserInstanceOrganizations(context, { id, params }) {
    const [error, response] = await updateUserItemOrganizations(id, params)
    return [error, response]
  },

  setFilters({ commit }, filters) {
    for (const [key, value] of Object.entries(filters)) {
      commit('SET_FILTER', { filterKey: key, filterValue: value })
    }
  },

  setActivenessFilter({ commit }, filterValue) {
    commit('SET_ACTIVENESS_FILTER', filterValue)
  },

  resetFilters({ commit }) {
    commit('RESET_FILTERS')
  },
}
