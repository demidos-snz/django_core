import transport from '@/api/utils/transport'

const apiAppName = 'reports'

export const loadReportItems = (params) => {
  return transport.sendGet(`${apiAppName}/`, params)
}

export const createReportItem = ({ name, step, organizationId, dateFrom, dateTo }) => {
  return transport.sendPost(`${apiAppName}/`, { name, step, organizationId, dateFrom, dateTo })
}

export const updateReportItem = (id, params) => {
  return transport.sendPatch(`${apiAppName}/${id}/`, params)
}

export const deleteReportItem = (id, params) => {
  return transport.sendDelete(`${apiAppName}/${id}`, params)
}
