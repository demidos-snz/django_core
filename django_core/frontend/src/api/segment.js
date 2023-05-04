import transport from '@/api/utils/transport'

const apiAppName = 'segments'

export const createSegmentItem = ({ organizationId, name, internetAccess, isOcii }) => {
  return transport.sendPost(`${apiAppName}/`, { organizationId, name, internetAccess, isOcii })
}

export const updateSegmentItem = (id, params) => {
  return transport.sendPatch(`${apiAppName}/${id}/`, params)
}

export const deleteSegmentItem = (id, params) => {
  return transport.sendDelete(`${apiAppName}/${id}/`, params)
}
