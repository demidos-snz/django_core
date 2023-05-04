import {
  loadBulletinItems,
  createBulletinItem,
  deleteBulletinItem,
  markBulletinRead,
  downloadBulletin,
} from '@/api/bulletins'
import { isNil } from 'lodash'
import { prepareRequestParams } from '@/store/modules/incidents/utils'
import { bulletinTableHeadersToFieldMap } from '@/constants/constants'

function downloadURI(uri, name) {
  const link = document.createElement('a')
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const actions = {
  updateBulletin({ commit }, bulletin) {
    commit('UPDATE_BULLETIN', bulletin)
  },

  setHasNewBulletins({ commit }, hasNewBulletins) {
    commit('SET_HAS_NEW_BULLETINS', hasNewBulletins)
  },

  setLoading({ commit }, isLoading) {
    commit('SET_LOADING', isLoading)
  },

  setSearchText({ commit, dispatch }, text) {
    commit('SET_SEARCH_TEXT', text)
    dispatch('loadBulletins')
  },

  setFilters({ commit }, filterData) {
    commit('SET_FILTERS', filterData)
  },

  addFilter({ commit, dispatch }, filterData) {
    let isEmptyFilter = isNil(filterData.val)
    if (filterData.filterType === 'combobox' && filterData.multiple) {
      isEmptyFilter = isEmptyFilter || filterData.val.length < 1
    } else if (filterData.filterType === 'period') {
      isEmptyFilter = isEmptyFilter || !filterData.val.start || !filterData.val.end
    }

    if (isEmptyFilter) {
      commit('CLEAR_FILTER', filterData.filterKey)
    } else {
      commit('ADD_FILTER', filterData)
    }

    dispatch('loadBulletins')
  },

  clearFilter({ commit, dispatch }, filterData) {
    commit('CLEAR_FILTER', filterData.filterKey)

    dispatch('loadBulletins')
  },

  handlePagination({ commit, state, dispatch }, paginationData) {
    let needReload = false
    if (paginationData.page !== state.page) {
      needReload = true
      commit('SET_PAGE', paginationData.page)
    }
    if (paginationData.itemsPerPage !== state.itemsPerPage) {
      needReload = true
      commit('SET_ITEMS_PER_PAGE', paginationData.itemsPerPage)
    }

    if (needReload) {
      dispatch('loadBulletins')
    }
  },

  handleSortBy({ commit, state, dispatch }, sortBy) {
    let sortByCol = Array.isArray(sortBy) ? sortBy[0] : sortBy

    if (isNil(sortByCol)) {
      sortByCol = 'id'
    } else {
      sortByCol = bulletinTableHeadersToFieldMap[sortByCol]
    }

    if (sortByCol !== state.sortBy) {
      commit('SET_SORT_BY', sortByCol)
      dispatch('loadBulletins')
    }
  },

  handleSortDesc({ state, commit, dispatch }, sortDesc) {
    let sortDescCol = Array.isArray(sortDesc) ? sortDesc[0] : sortDesc
    if (isNil(sortDescCol)) sortDescCol = false

    if (sortDescCol !== state.sortDesc) {
      commit('SET_SORT_DESC', sortDescCol)
      dispatch('loadBulletins')
    }
  },

  async loadBulletins({ state, dispatch, commit }) {
    dispatch('setLoading', true)
    const params = prepareRequestParams(state.filters)

    params.page = state.page
    params.limit = state.itemsPerPage

    if (!isNil(state.searchText)) {
      params.search = state.searchText
    }

    const sortBy = state.sortBy

    if (!isNil(sortBy)) {
      params.ordering = state.sortDesc ? `-${sortBy}` : sortBy
    }

    const [error, response] = await loadBulletinItems(params)
    if (isNil(error) && response.status === 200) {
      commit('SET_LOADED_BULLETINS', response.data)
    } else if (error) {
      if (state.page !== 1) {
        commit('SET_PAGE', 1)
        dispatch('loadBulletins')
      }
    }

    dispatch('setLoading', false)
  },

  async createBulletinInstance(context, params) {
    const [error, response] = await createBulletinItem(params)
    return [error, response]
  },

  async deleteBulletinInstance(context, bulletinId) {
    await deleteBulletinItem(bulletinId)
  },

  async markBulletinRead(context, bulletinId) {
    await markBulletinRead(bulletinId)
  },

  async downloadBulletin(context, bulletin) {
    const [error, response] = await downloadBulletin(bulletin.id)
    if (isNil(error) && response.status === 200) {
      const fileLink = response.data.file
      downloadURI(fileLink, bulletin.name)
      return response
    }
  },
}
