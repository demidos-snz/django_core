import { loadReportItems, createReportItem, updateReportItem, deleteReportItem } from '@/api/reports'
import { isNil } from 'lodash'
import { prepareRequestParams } from '@/store/modules/incidents/utils'
import { reportTableHeadersToFieldMap } from '@/constants/constants'

export const actions = {
  setLoading({ commit }, isLoading) {
    commit('SET_LOADING', isLoading)
  },

  setSearchText({ commit, dispatch }, text) {
    commit('SET_SEARCH_TEXT', text)
    dispatch('loadReports')
  },

  updateReport({ commit }, report) {
    commit('UPDATE_REPORT', report)
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

    dispatch('loadReports')
  },

  clearFilter({ commit, dispatch }, filterData) {
    commit('CLEAR_FILTER', filterData.filterKey)

    dispatch('loadReports')
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
      dispatch('loadReports')
    }
  },

  handleSortBy({ commit, state, dispatch }, sortBy) {
    let sortByCol = Array.isArray(sortBy) ? sortBy[0] : sortBy

    if (isNil(sortByCol)) {
      sortByCol = 'id'
    } else {
      sortByCol = reportTableHeadersToFieldMap[sortByCol]
    }

    if (sortByCol !== state.sortBy) {
      commit('SET_SORT_BY', sortByCol)
      dispatch('loadReports')
    }
  },

  handleSortDesc({ state, commit, dispatch }, sortDesc) {
    let sortDescCol = Array.isArray(sortDesc) ? sortDesc[0] : sortDesc
    if (isNil(sortDescCol)) sortDescCol = false

    if (sortDescCol !== state.sortDesc) {
      commit('SET_SORT_DESC', sortDescCol)
      dispatch('loadReports')
    }
  },

  async loadReports({ state, dispatch, commit }) {
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

    const [error, response] = await loadReportItems(params)
    if (isNil(error) && response.status === 200) {
      commit('SET_LOADED_REPORTS', response.data)
    } else if (error) {
      commit('SET_PAGE', 1)
      dispatch('loadReports')
    }

    dispatch('setLoading', false)
  },

  async createReportInstance(context, params) {
    const [error, response] = await createReportItem(params)
    return [error, response]
  },

  async updateReportInstance(context, { id, params }) {
    const [error, response] = await updateReportItem(id, params)
    return [error, response]
  },

  async deleteReportInstance(context, reportId) {
    await deleteReportItem(reportId)
  },
}
