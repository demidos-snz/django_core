import Vue from 'vue'

export const mutations = {
  SET_LOADING(state, isLoading) {
    Vue.set(state, 'isLoading', isLoading)
  },

  SET_SEARCH_TEXT(state, text) {
    Vue.set(state, 'searchText', text)
  },

  SET_LOADED_REPORTS(state, data) {
    Vue.set(state, 'totalItems', data.count)
    Vue.set(state, 'reports', data.results)
  },

  SET_FILTERS(state, filters) {
    Vue.set(state, 'filters', filters)
  },

  CLEAR_FILTER(state, key) {
    Vue.delete(state.filters, key)
  },

  ADD_FILTER(state, filter) {
    Vue.set(state.filters, filter.filterKey, filter)
  },

  SET_PAGE(state, page) {
    Vue.set(state, 'page', page)
  },

  SET_ITEMS_PER_PAGE(state, perPage) {
    Vue.set(state, 'itemsPerPage', perPage)
  },

  SET_SORT_BY(state, sortBy) {
    Vue.set(state, 'sortBy', sortBy)
  },

  SET_SORT_DESC(state, sortDesc) {
    Vue.set(state, 'sortDesc', sortDesc)
  },

  UPDATE_REPORT(state, report) {
    const index = state.reports.findIndex((item) => report.id === item.id)

    if (index < 0) return

    const storedReport = state.reports[index]
    const merged = { ...storedReport, ...report }

    Vue.set(state.reports, index, merged)
  },
}
