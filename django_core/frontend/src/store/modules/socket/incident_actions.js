import router from '@/router'

export const incidentActions = {
  SOCKET_incident_added({ dispatch }) {
    dispatch('incidents/loadIncidents', null, { root: true })
  },

  SOCKET_incident_updated({ dispatch }, incident) {
    dispatch('incidents/incidentUpdated', incident, { root: true })
  },

  SOCKET_incident_removed({ dispatch }) {
    dispatch('incidents/loadIncidents', null, { root: true })
  },

  openIncident(context, incidentId) {
    const params = {
      event: 'open_incident',
      data: {
        incidentId,
      },
    }

    this.$socket.sendObj(params)
  },

  closeIncident() {
    const params = {
      event: 'close_incident',
      data: {},
    }

    this.$socket.sendObj(params)
  },

  SOCKET_close_incident({ commit }) {
    commit('incidents/UNLOAD_INCIDENT_DATA', null, { root: true })
    if (router.currentRoute.params.incidentId) {
      router.push('/incidents').then()
    }
  },

  SOCKET_incident_load_end({ dispatch }) {
    dispatch('incidents/setIncidentLoading', false, { root: true })
  },

  SOCKET_incident_data({ dispatch }, data) {
    dispatch('incidents/setCurrentIncident', data, { root: true })
  },

  SOCKET_recommendation_samples({ dispatch }, { samples }) {
    dispatch('incidents/setRecommendationSamples', samples, { root: true })
  },

  SOCKET_recommendation_sample_added({ dispatch }, sample) {
    dispatch('incidents/addRecommendationSample', sample, { root: true })
  },

  SOCKET_recommendations({ dispatch }, { recommendations }) {
    dispatch('incidents/setRecommendations', recommendations, { root: true })
  },

  SOCKET_incident_recommendation_updated({ dispatch }, recommendation) {
    dispatch('incidents/recommendationUpdated', recommendation, { root: true })
  },

  SOCKET_action_taken_samples({ dispatch }, { samples }) {
    dispatch('incidents/setActionsTakenSamples', samples, { root: true })
  },

  SOCKET_action_taken_sample_added({ dispatch }, sample) {
    dispatch('incidents/addActionTakenSample', sample, { root: true })
  },

  SOCKET_actions_taken({ dispatch }, { actionsTaken }) {
    dispatch('incidents/setActionsTaken', actionsTaken, { root: true })
  },

  SOCKET_incident_history_actions({ dispatch }, { actions }) {
    dispatch('incidents/setHistoryActions', actions, { root: true })
  },

  SOCKET_incident_history_action_added({ dispatch }, historyAction) {
    dispatch('incidents/addHistoryAction', historyAction, { root: true })
  },

  SOCKET_incident_comments({ dispatch }, { comments }) {
    dispatch('incidents/setComments', comments, { root: true })
  },

  SOCKET_incident_comment_added({ dispatch }, comment) {
    dispatch('incidents/addComment', comment, { root: true })
  },

  SOCKET_incident_comment_removed({ dispatch }, { commentId }) {
    dispatch('incidents/removeComment', commentId, { root: true })
  },

  SOCKET_incident_attachments({ dispatch }, { attachments }) {
    dispatch('incidents/setAttachments', attachments, { root: true })
  },

  SOCKET_incident_attachment_added({ dispatch }, attachment) {
    dispatch('incidents/addAttachment', attachment, { root: true })
  },

  SOCKET_incident_attachment_removed({ dispatch }, { attachmentId }) {
    dispatch('incidents/removeAttachment', attachmentId, { root: true })
  },

  SOCKET_available_operators({ dispatch }, { availableOperators }) {
    dispatch('incidents/setAvailableOperators', availableOperators, { root: true })
  },

  SOCKET_mp_events({ dispatch }, { events }) {
    dispatch('incidents/setEvents', events, { root: true })
  },

  SOCKET_events_added({ dispatch }, { events }) {
    dispatch('incidents/addEvents', events, { root: true })
  },

  SOCKET_incident_event_deleted({ dispatch }, { eventId }) {
    dispatch('incidents/removeEvent', eventId, { root: true })
  },

  SOCKET_incident_ncircc_notification({ dispatch }, notification) {
    dispatch('incidents/storeNcirccNotification', notification, { root: true })
  },

  SOCKET_incident_ncircc_notification_comments({ dispatch }, { comments }) {
    dispatch('incidents/setNcirccComments', comments, { root: true })
  },

  SOCKET_ncircc_comment_added({ dispatch }, comment) {
    dispatch('incidents/addNcirccComment', comment, { root: true })
  },

  SOCKET_incident_ncircc_notification_evidences({ dispatch }, { evidences }) {
    dispatch('incidents/setNcirccEvidences', evidences, { root: true })
  },

  SOCKET_ncircc_evidence_added({ dispatch }, evidence) {
    dispatch('incidents/addNcirccEvidence', evidence, { root: true })
  },

  SOCKET_ncircc_evidence_updated({ dispatch }, evidence) {
    dispatch('incidents/updateNcirccEvidence', evidence, { root: true })
  },

  SOCKET_verdict_reasons({ dispatch }, { verdictReasons }) {
    dispatch('incidents/setVerdictReasons', verdictReasons, { root: true })
  },
}
