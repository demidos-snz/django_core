import transport from '@/api/utils/transport'
const apiAppName = 'networks'

export const createNetworkItem = ({ address, internetAccess, name, isOcii, segmentId }) => {
  return transport.sendPost(`${apiAppName}/`, { address, internetAccess, name, isOcii, segmentId })
}

export const updateNetworkItem = (id, params) => {
  return transport.sendPatch(`${apiAppName}/${id}/`, params)
}

export const deleteNetworkItem = (id, params) => {
  return transport.sendDelete(`${apiAppName}/${id}/`, params)
}
