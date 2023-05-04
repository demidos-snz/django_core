import { prepareRequestParams } from '@/store/modules/incidents/utils'
import { isNil } from 'lodash'
import {
  addAttachment,
  changeIncidentActionsTaken,
  changeIncidentRecommendations,
  confirmRecommendation,
  createComment,
  createIncident,
  createNcirccNotification,
  createNcirccNotificationComment,
  deleteActionTaken,
  deleteAttachment,
  deleteComment,
  deleteIncident,
  deleteRecommendation,
  loadIncidents,
  reorderRecommendations,
  reorderActionsTaken,
  sendConfirmation,
  updateIncident,
  updateNcirccNotification,
  addEvidence,
  exportAsPdf,
} from '@/api/incidents'
import router from '@/router'
import { createRecommendationSample } from '@/api/recommendation_samples'
import { createActionTakenSample } from '@/api/action_taken_samples'

export const actions = {
  setIsLoading({ commit }, isLoading) {
    commit('SET_IS_LOADING', isLoading)
  },

  openIncident({ dispatch }, incidentId) {
    dispatch('setIncidentLoading', true)
    dispatch('socket/openIncident', incidentId, { root: true })
  },

  closeIncident({ dispatch, commit }) {
    dispatch('socket/closeIncident', null, { root: true })
    commit('UNLOAD_INCIDENT_DATA')
  },

  storeSearchText({ commit, dispatch }, text) {
    commit('STORE_SEARCH_TEXT', text)
    dispatch('loadIncidents')
  },

  incidentUpdated({ state, commit, dispatch }, incidentData) {
    if (!isNil(state.incidentData)) {
      const openedIncidentId = state.incidentData.id
      if (openedIncidentId === incidentData.id) {
        commit('UPDATE_INCIDENT', incidentData)
      }
    }
    dispatch('loadIncidents')
  },

  changeCmLine({ commit, dispatch }, cmLine) {
    switch (cmLine) {
      case 0:
        commit('RESET_FILTER', 'cm_line')
        break
      case 1:
      case 2:
        commit('STORE_CM_LINE', cmLine)
        break
      default:
        return
    }

    dispatch('loadIncidents')
  },

  async createIncident(context, newIncident) {
    const [error, response] = await createIncident(newIncident)
    if (isNil(error) && response.status === 201) {
      router.push({ name: 'incidents', params: { incidentId: response.data.id } })
      return true
    }
    return false
  },

  async updateIncident({ state }, params) {
    params.incidentId = state.incidentData.id
    const [error, response] = await updateIncident(params)
    return [error, response]
  },

  sendConfirmation({ state }) {
    const incidentId = state.incidentData.id
    sendConfirmation({ incidentId }).then()
  },

  async deleteIncident({ dispatch }, incidentId) {
    const [error, response] = await deleteIncident({ incidentId })
    if (isNil(error) && response.status === 200) {
      await router.push({ name: 'incidents' })
      dispatch('closeIncident')
    }
  },

  async loadIncidents({ state, dispatch, commit }) {
    dispatch('setIsLoading', true)
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

    const [error, response] = await loadIncidents(params)
    if (isNil(error) && response.status === 200) {
      commit('STORE_LOADED_INCIDENTS_DATA', response.data)
    } else if (error) {
      if (state.page !== 1) {
        commit('SET_PAGE', 1)
        dispatch('loadIncidents')
      }
    }

    dispatch('setIsLoading', false)
  },

  setFilters({ commit }, filterData) {
    commit('SET_FILTERS', filterData)
  },

  applyFilter({ commit, dispatch }, filterData) {
    let isEmptyFilter = isNil(filterData.val)
    if (filterData.filterType === 'combobox' && filterData.multiple) {
      isEmptyFilter = isEmptyFilter || filterData.val.length < 1
    } else if (filterData.filterType === 'period') {
      isEmptyFilter = isEmptyFilter || !filterData.val.start || !filterData.val.end
    }

    if (isEmptyFilter) {
      commit('RESET_FILTER', filterData.filterKey)
    } else {
      commit('ADD_FILTER', filterData)
    }

    dispatch('loadIncidents')
  },

  removeFilter({ commit, dispatch }, filterData) {
    commit('RESET_FILTER', filterData.filterKey)

    dispatch('loadIncidents')
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
      dispatch('loadIncidents')
    }
  },

  handleSortBy({ commit, state, dispatch }, sortBy) {
    let sortByCol = Array.isArray(sortBy) ? sortBy[0] : sortBy
    if (sortByCol === 'hrid') sortByCol = 'id'

    if (isNil(sortByCol)) {
      sortByCol = 'id'
    }

    if (sortByCol !== state.sortBy) {
      commit('SET_SORT_BY', sortByCol)
      dispatch('loadIncidents')
    }
  },

  handleSortDesc({ state, commit, dispatch }, sortDesc) {
    let sortDescCol = Array.isArray(sortDesc) ? sortDesc[0] : sortDesc
    if (isNil(sortDescCol)) sortDescCol = false

    if (sortDescCol !== state.sortDesc) {
      commit('SET_SORT_DESC', sortDescCol)
      dispatch('loadIncidents')
    }
  },

  // incident actions
  setIncidentLoading({ commit }, isLoading) {
    commit('SET_INCIDENT_LOADING', isLoading)
  },

  setCurrentIncident({ commit }, incidentData) {
    commit('SET_CURRENT_INCIDENT_DATA', incidentData)
  },

  setRecommendationSamples({ commit }, samples) {
    commit('SET_RECOMMENDATION_SAMPLES', samples)
  },

  addRecommendationSample({ commit }, sample) {
    commit('ADD_RECOMMENDATION_SAMPLE', sample)
  },

  setRecommendations({ commit }, recommendations) {
    commit('SET_RECOMMENDATIONS', recommendations)
  },

  updateRecommendations({ state }, recommendationIds) {
    const incidentId = state.incidentData.id
    return changeIncidentRecommendations({ incidentId, recommendationIds })
  },

  confirmRecommendation({ state }, params) {
    const incidentId = state.incidentData.id
    const data = {
      incidentId,
      ...params,
    }
    return confirmRecommendation(data)
  },

  reorderRecommendations({ commit, state }, newOrder) {
    const incidentId = state.incidentData.id
    commit('REORDER_RECOMMENDATIONS', newOrder)
    return reorderRecommendations({ incidentId, newOrder })
  },

  reorderActionsTaken({ commit, state }, newOrder) {
    const incidentId = state.incidentData.id
    commit('REORDER_ACTIONS_TAKEN', newOrder)
    return reorderActionsTaken({ incidentId, newOrder })
  },

  recommendationUpdated({ commit }, recommendation) {
    commit('UPDATE_RECOMMENDATION', recommendation)
  },

  setActionsTakenSamples({ commit }, samples) {
    commit('SET_ACTIONS_TAKEN_SAMPLES', samples)
  },

  addActionTakenSample({ commit }, sample) {
    commit('ADD_ACTION_TAKEN_SAMPLE', sample)
  },

  setActionsTaken({ commit }, actionsTaken) {
    commit('SET_ACTIONS_TAKEN', actionsTaken)
  },

  updateActionsTaken({ state }, actionTakenIds) {
    const incidentId = state.incidentData.id
    return changeIncidentActionsTaken({ incidentId, actionTakenIds })
  },

  setHistoryActions({ commit }, actions) {
    commit('SET_HISTORY_ACTIONS', actions)
  },

  addHistoryAction({ commit }, historyAction) {
    commit('ADD_HISTORY_ACTION', historyAction)
  },

  setComments({ commit }, comments) {
    commit('SET_COMMENTS', comments)
  },

  addComment({ commit }, comment) {
    commit('ADD_COMMENT', comment)
  },

  removeComment({ commit }, commentId) {
    commit('REMOVE_COMMENT', commentId)
  },

  setAttachments({ commit }, attachments) {
    commit('SET_ATTACHMENTS', attachments)
  },

  addAttachment({ commit }, attachment) {
    commit('ADD_ATTACHMENT', attachment)
  },

  removeAttachment({ commit }, attachmentId) {
    commit('REMOVE_ATTACHMENT', attachmentId)
  },

  setAvailableOperators({ commit }, operators) {
    commit('SET_AVAILABLE_OPERATORS', operators)
  },

  createRecommendationSample({ state }, text) {
    const organizationId = state.incidentData.organizationId
    return createRecommendationSample({ text, organizationId })
  },

  createActionTakenSample({ state }, text) {
    const incidentId = state.incidentData.id
    return createActionTakenSample({ incidentId, text })
  },

  createComment({ state }, text) {
    const incidentId = state.incidentData.id
    return createComment({ incidentId, text })
  },

  deleteComment({ state }, commentId) {
    const incidentId = state.incidentData.id
    return deleteComment({ incidentId, commentId })
  },

  async createAttachment({ state }, data) {
    const incidentId = state.incidentData.id
    const [error, response] = await addAttachment(incidentId, data)
    return [error, response]
  },

  deleteAttachment({ state }, attachmentId) {
    const incidentId = state.incidentData.id
    return deleteAttachment({ incidentId, attachmentId })
  },

  deleteRecommendation({ state }, recommendationId) {
    const incidentId = state.incidentData.id
    return deleteRecommendation({ incidentId, recommendationId })
  },

  deleteActionTaken({ state }, actionTakenId) {
    const incidentId = state.incidentData.id
    return deleteActionTaken({ incidentId, actionTakenId })
  },

  setEvents({ commit }, events) {
    commit('SET_EVENTS', events)
  },

  addEvents({ commit }, events) {
    commit('ADD_EVENTS', events)
  },

  removeEvent({ commit }, eventId) {
    commit('REMOVE_EVENT', eventId)
  },

  createNcirccNotification({ state }, data) {
    const incidentId = state.incidentData.id
    return createNcirccNotification({ incidentId, data })
  },

  updateNcirccNotification({ state }, data) {
    const incidentId = state.incidentData.id
    return updateNcirccNotification({ incidentId, data })
  },

  async createNcirccNotificationComment({ state }, text) {
    const incidentId = state.incidentData.id
    const [error, response] = await createNcirccNotificationComment({ incidentId, text })
    return [error, response]
  },

  storeNcirccNotification({ commit }, data) {
    commit('STORE_NCIRCC_NOTIFICATION', data)
  },

  setNcirccComments({ commit }, comments) {
    commit('SET_NCIRCC_COMMENTS', comments)
  },

  addNcirccComment({ commit }, comment) {
    commit('ADD_NCIRCC_COMMENT', comment)
  },

  setNcirccEvidences({ commit }, evidences) {
    commit('SET_NCIRCC_EVIDENCES', evidences)
  },

  addNcirccEvidence({ commit }, evidence) {
    commit('ADD_NCIRCC_EVIDENCE', evidence)
  },

  updateNcirccEvidence({ commit }, evidence) {
    commit('UPDATE_NCIRCC_EVIDENCE', evidence)
  },

  async createEvidence({ state }, data) {
    const incidentId = state.incidentData.id
    const [error, response] = await addEvidence(incidentId, data)
    return [error, response]
  },

  setDisplayedColumns({ commit }, displayedColumns) {
    commit('SET_DISPLAYED_COLUMNS', displayedColumns)
  },

  setVerdictReasons({ commit }, verdictReasons) {
    commit('SET_VERDICT_REASONS', verdictReasons)
  },

  exportIncidentAsPdf(context, incidentId) {
    return exportAsPdf(incidentId)
  },
}
