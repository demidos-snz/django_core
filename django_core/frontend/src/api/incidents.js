import transport from '@/api/utils/transport'

const apiAppName = 'incidents'

export const loadIncidents = (params) => {
  return transport.sendGet(`${apiAppName}/`, params)
}

export const createIncident = ({ organizationId, name, typeIncident, severityLevel }) => {
  return transport.sendPost(`${apiAppName}/`, { organizationId, name, typeIncident, severityLevel })
}

export const updateIncident = ({
  incidentId,
  name,
  description,
  typeIncident,
  severityLevel,
  status,
  cmLine,
  assignedId,
  verdict,
  verdictReason,
}) => {
  return transport.sendPatch(`${apiAppName}/${incidentId}/`, {
    name,
    description,
    typeIncident,
    severityLevel,
    status,
    cmLine,
    assignedId,
    verdict,
    verdictReason,
  })
}

export const sendConfirmation = ({ incidentId }) => {
  return transport.sendPost(`${apiAppName}/${incidentId}/to_client/`)
}

export const deleteIncident = ({ incidentId }) => {
  return transport.sendDelete(`${apiAppName}/${incidentId}/`)
}

export const createComment = ({ incidentId, text }) => {
  return transport.sendPost(`${apiAppName}/${incidentId}/comments/`, { text })
}

export const deleteComment = ({ incidentId, commentId }) => {
  return transport.sendDelete(`${apiAppName}/${incidentId}/comments/${commentId}/`)
}

export const addAttachment = (incidentId, data) => {
  const attachmentData = new FormData()

  for (const key in data) {
    attachmentData.append(key, data[key])
  }

  return transport.sendPostFormData(`${apiAppName}/${incidentId}/attachments/`, attachmentData)
}

export const deleteAttachment = ({ incidentId, attachmentId }) => {
  return transport.sendDelete(`${apiAppName}/${incidentId}/attachments/${attachmentId}/`)
}

export const deleteRecommendation = ({ incidentId, recommendationId }) => {
  return transport.sendDelete(`${apiAppName}/${incidentId}/recommendations/${recommendationId}/`)
}

export const deleteActionTaken = ({ incidentId, actionTakenId }) => {
  return transport.sendDelete(`${apiAppName}/${incidentId}/actions_taken/${actionTakenId}/`)
}

export const changeIncidentRecommendations = ({ incidentId, recommendationIds }) => {
  return transport.sendPut(`${apiAppName}/${incidentId}/recommendations/`, { recommendationIds })
}

export const confirmRecommendation = ({ incidentId, recommendationId, confirmed }) => {
  return transport.sendPost(`${apiAppName}/${incidentId}/recommendations/${recommendationId}/confirm/`, { confirmed })
}

export const changeIncidentActionsTaken = ({ incidentId, actionTakenIds }) => {
  return transport.sendPut(`${apiAppName}/${incidentId}/actions_taken/`, { actionTakenIds })
}

export const reorderRecommendations = ({ incidentId, newOrder }) => {
  return transport.sendPatch(`${apiAppName}/${incidentId}/recommendations/`, { newOrder })
}

export const reorderActionsTaken = ({ incidentId, newOrder }) => {
  return transport.sendPatch(`${apiAppName}/${incidentId}/actions_taken/`, { newOrder })
}

export const createNcirccNotification = ({ incidentId, data }) => {
  return transport.sendPost(`${apiAppName}/${incidentId}/ncircc/`, { data })
}

export const updateNcirccNotification = ({ incidentId, data }) => {
  return transport.sendPatch(`${apiAppName}/${incidentId}/ncircc/`, { data })
}

export const createNcirccNotificationComment = ({ incidentId, text }) => {
  return transport.sendPost(`${apiAppName}/${incidentId}/ncircc/comments/`, { text })
}

export const addEvidence = (incidentId, data) => {
  const evidenceData = new FormData()

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      evidenceData.append(key, data[key])
    }
  }

  return transport.sendPostFormData(`${apiAppName}/${incidentId}/ncircc/evidences/`, evidenceData)
}

export const exportAsPdf = (incidentId) => {
  return transport.sendGet(`${apiAppName}/${incidentId}/pdf/`, {}, true, 'blob')
}
