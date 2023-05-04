import transport from '@/api/utils/transport'
const apiAppName = 'nodes'

export const createNodeItem = ({
  networkId,
  // operatingSystemId,
  // processedDataTypeId,
  macAddress,
  privateIpAddress,
  publicIpAddress,
  internetAccess,
  isOcii,
  processedDataSecrecy,
  informationSource,
  criticality,
  estimatedCost,
  hostname,
  geoAddress,
}) => {
  return transport.sendPost(`${apiAppName}/`, {
    networkId,
    operatingSystemId: 1,
    processedDataTypeId: 1,
    macAddress,
    privateIpAddress,
    publicIpAddress,
    internetAccess,
    isOcii,
    processedDataSecrecy,
    informationSource,
    criticality,
    estimatedCost,
    hostname,
    geoAddress,
  })
}

export const updateNodeItem = (id, params) => {
  return transport.sendPatch(`${apiAppName}/${id}/`, params)
}

export const deleteNodeItem = (id, params) => {
  return transport.sendDelete(`${apiAppName}/${id}/`, params)
}
