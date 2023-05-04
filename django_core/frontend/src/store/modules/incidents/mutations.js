import Vue from 'vue'

export const mutations = {
  SET_IS_LOADING(state, isLoading) {
    Vue.set(state, 'isLoading', isLoading)
  },

  STORE_SEARCH_TEXT(state, text) {
    Vue.set(state, 'searchText', text)
  },

  STORE_CM_LINE(state, cmLine) {
    Vue.set(state.filters, 'cm_line', cmLine)
  },

  STORE_LOADED_INCIDENTS_DATA(state, data) {
    Vue.set(state, 'totalItems', data.count)
    Vue.set(state, 'incidents', data.results)
  },

  SET_FILTERS(state, filters) {
    Vue.set(state, 'filters', filters)
  },

  RESET_FILTER(state, key) {
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

  SET_INCIDENT_LOADING(state, isLoading) {
    Vue.set(state, 'incidentLoading', isLoading)
  },

  SET_CURRENT_INCIDENT_DATA(state, incidentData) {
    Vue.set(state, 'incidentData', incidentData)
  },

  SET_RECOMMENDATION_SAMPLES(state, samples) {
    Vue.set(state, 'recommendationSamples', samples)
  },

  ADD_RECOMMENDATION_SAMPLE(state, sample) {
    const stateSamples = state.recommendationSamples
    const sampleIndex = stateSamples.findIndex((oldSample) => oldSample.id === sample.id)
    if (sampleIndex > 0) return
    Vue.set(state, 'recommendationSamples', [...stateSamples, sample])
  },

  SET_RECOMMENDATIONS(state, recommendations) {
    Vue.set(state, 'recommendations', recommendations)
  },

  UPDATE_INCIDENT(state, updatedIncident) {
    const stateIncident = state.incidentData
    const newIncidentData = { ...stateIncident, ...updatedIncident }
    Vue.set(state, 'incidentData', newIncidentData)
  },

  REORDER_RECOMMENDATIONS(state, newOrder) {
    const stateRecommendations = [...state.recommendations]
    for (const recommendation of stateRecommendations) {
      recommendation.order = newOrder.indexOf(recommendation.id) + 1
    }

    Vue.set(state, 'recommendations', stateRecommendations)
  },

  UPDATE_RECOMMENDATION(state, updatedRecommendation) {
    const index = state.recommendations.findIndex((recommendation) => recommendation.id === updatedRecommendation.id)
    if (index < 0) return
    const stateRecommendation = state.recommendations[index]
    const newRecommendation = { ...stateRecommendation, ...updatedRecommendation }
    Vue.set(state.recommendations, index, newRecommendation)
  },

  SET_ACTIONS_TAKEN_SAMPLES(state, samples) {
    Vue.set(state, 'actionsTakenSamples', samples)
  },

  ADD_ACTION_TAKEN_SAMPLE(state, sample) {
    const stateSamples = state.actionsTakenSamples
    const sampleIndex = stateSamples.findIndex((oldSample) => oldSample.id === sample.id)
    if (sampleIndex > 0) return
    Vue.set(state, 'actionsTakenSamples', [...stateSamples, sample])
  },

  SET_ACTIONS_TAKEN(state, actionsTaken) {
    Vue.set(state, 'actionsTaken', actionsTaken)
  },

  REORDER_ACTIONS_TAKEN(state, newOrder) {
    const stateActionsTaken = [...state.actionsTaken]
    for (const action of stateActionsTaken) {
      action.order = newOrder.indexOf(action.id) + 1
    }

    Vue.set(state, 'actionsTaken', stateActionsTaken)
  },

  SET_HISTORY_ACTIONS(state, historyActions) {
    Vue.set(state, 'historyActions', historyActions)
  },

  ADD_HISTORY_ACTION(state, historyAction) {
    const index = state.historyActions.findIndex((action) => action.id === historyAction.id)
    if (index > 0) return

    const newActions = [...state.historyActions, historyAction]
    Vue.set(state, 'historyActions', newActions)
  },

  SET_COMMENTS(state, comments) {
    Vue.set(state, 'comments', comments)
  },

  ADD_COMMENT(state, newComment) {
    const index = state.comments.findIndex((comment) => comment.id === newComment.id)
    if (index > 0) return

    const newComments = [...state.comments, newComment]
    Vue.set(state, 'comments', newComments)
  },

  REMOVE_COMMENT(state, commentId) {
    const comments = state.comments.filter((comment) => comment.id !== commentId)
    Vue.set(state, 'comments', comments)
  },

  SET_ATTACHMENTS(state, attachments) {
    Vue.set(state, 'attachments', attachments)
  },

  ADD_ATTACHMENT(state, newAttachment) {
    const index = state.attachments.findIndex((attachment) => attachment.id === newAttachment.id)
    if (index > 0) return

    const newAttachments = [...state.attachments, newAttachment]
    Vue.set(state, 'attachments', newAttachments)
  },

  REMOVE_ATTACHMENT(state, attachmentId) {
    const attachments = state.attachments.filter((attachment) => attachment.id !== attachmentId)
    Vue.set(state, 'attachments', attachments)
  },

  SET_AVAILABLE_OPERATORS(state, operators) {
    Vue.set(state, 'availableOperators', operators)
  },

  SET_EVENTS(state, events) {
    Vue.set(state, 'events', events)
  },

  ADD_EVENTS(state, events) {
    const stateEvents = state.events
    Vue.set(state, 'events', [...stateEvents, ...events])
  },

  REMOVE_EVENT(state, eventId) {
    const events = state.events.filter((event) => event.id !== eventId)
    Vue.set(state, 'events', events)
  },

  UNLOAD_INCIDENT_DATA(state) {
    Vue.set(state, 'incidentLoading', false)
    Vue.set(state, 'incidentData', null)
    Vue.set(state, 'recommendationSamples', [])
    Vue.set(state, 'recommendations', [])
    Vue.set(state, 'actionsTakenSamples', [])
    Vue.set(state, 'actionsTaken', [])
    Vue.set(state, 'historyActions', [])
    Vue.set(state, 'comments', [])
    Vue.set(state, 'attachments', [])
    Vue.set(state, 'availableOperators', [])
    Vue.set(state, 'events', [])
    Vue.set(state, 'ncircc', null)
    Vue.set(state, 'ncirccComments', [])
    Vue.set(state, 'ncirccEvidences', [])
  },

  RESET(state) {
    Vue.set(state, 'incidents', [])
    Vue.set(state, 'page', 1)
    Vue.set(state, 'itemsPerPage', 10)
    Vue.set(state, 'isLoading', false)
    Vue.set(state, 'totalItems', 0)
    Vue.set(state, 'searchText', '')
    Vue.set(state, 'sortBy', 'id')
    Vue.set(state, 'sortDesc', false)
    Vue.set(state, 'filters', {})
    Vue.set(state, 'displayedColumns', [
      'hrid',
      'name',
      'organization',
      'severity_level',
      'type_incident',
      'assigned',
      'status',
      'ncircc_notification__reg_number',
      'ncircc_notification__status',
      'registration_datetime',
      'closed_datetime',
    ])
  },

  STORE_NCIRCC_NOTIFICATION(state, data) {
    Vue.set(state, 'ncircc', data)
  },

  SET_NCIRCC_COMMENTS(state, data) {
    Vue.set(state, 'ncirccComments', data)
  },

  ADD_NCIRCC_COMMENT(state, newComment) {
    const index = state.ncirccComments.findIndex((comment) => comment.id === newComment.id)
    if (index > 0) return

    const newComments = [...state.ncirccComments, newComment]
    Vue.set(state, 'ncirccComments', newComments)
  },

  SET_NCIRCC_EVIDENCES(state, data) {
    Vue.set(state, 'ncirccEvidences', data)
  },

  ADD_NCIRCC_EVIDENCE(state, newEvidence) {
    const index = state.ncirccEvidences.findIndex((evidence) => evidence.id === newEvidence.id)
    if (index > 0) return

    const newEvidences = [...state.ncirccEvidences, newEvidence]
    Vue.set(state, 'ncirccEvidences', newEvidences)
  },

  UPDATE_NCIRCC_EVIDENCE(state, updatedEvidence) {
    const index = state.ncirccEvidences.findIndex((evidence) => evidence.id === updatedEvidence.id)
    if (index < 0) return

    const storedEvidence = state.ncirccEvidences[index]
    const merged = { ...storedEvidence, ...updatedEvidence }

    state.ncirccEvidences.splice(index, 1)
    state.ncirccEvidences.push(merged)
  },

  SET_DISPLAYED_COLUMNS(state, displayedColumns) {
    Vue.set(state, 'displayedColumns', displayedColumns)
  },

  SET_VERDICT_REASONS(state, verdictReasons) {
    Vue.set(state, 'verdictReasons', verdictReasons)
  },
}
