import transport from '@/api/utils/transport'

const apiAppName = 'sensors'

export const createSensorItem = ({
  segmentId,
  name,
  identifier,
  address,
  url,
  homeNet,
  typeSensor,
  login,
  password,
}) => {
  homeNet = homeNet.split(',')
  return transport.sendPost(`${apiAppName}/`, {
    segmentId,
    name,
    identifier,
    address,
    url,
    homeNet,
    typeSensor,
    login,
    password,
  })
}

export const updateSensorItem = (id, params) => {
  return transport.sendPatch(`${apiAppName}/${id}/`, params)
}

export const deleteSensorItem = (id, params) => {
  return transport.sendDelete(`${apiAppName}/${id}/`, params)
}

export const updateSensorItemSegments = (id, params) => {
  return transport.sendPut(`${apiAppName}/${id}/segments/`, params)
}
