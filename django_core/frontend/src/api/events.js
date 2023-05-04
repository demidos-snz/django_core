import transport from '@/api/utils/transport'
import snakecaseKeys from 'snakecase-keys'

const apiAppName = 'events'

export const getEvents = (params) => {
  const paramData = snakecaseKeys(params)
  return transport.sendGet(`${apiAppName}/`, paramData)
}

export const getPackEvents = ({ packUuid, page, perPage }) => {
  const params = snakecaseKeys({ page, perPage })
  return transport.sendGet(`${apiAppName}/${packUuid}/`, params)
}

export const addEventsToIncident = ({ incidentId, sensorId, siemId, eventIds, packUuid }) => {
  return transport.sendPost(`${apiAppName}/incidents/${incidentId}/`, {
    sensorId,
    siemId,
    eventIds,
    packUuid,
  })
}

export const removeIncidentEvent = ({ incidentId, eventId }) => {
  return transport.sendDelete(`incidents/${incidentId}/events/${eventId}/`)
}

export const loadAsFile = ({ eventId, incidentId, formatFile }) => {
  const params = snakecaseKeys({ eventId, incidentId, formatFile })
  return transport.sendGet(`${apiAppName}/load/`, params)
}

export const removeTmpEvents = ({ packUuid }) => {
  return transport.sendDelete(`${apiAppName}/${packUuid}/`)
}
