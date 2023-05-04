import transport from '@/api/utils/transport'

const apiAppName = 'siems'

export const createSiemItem = ({ name, identifier, typeSiem, address, url, login, password }) => {
  return transport.sendPost(`${apiAppName}/`, { name, identifier, typeSiem, address, url, login, password })
}

export const updateSiemItem = (id, params) => {
  return transport.sendPatch(`${apiAppName}/${id}/`, params)
}

export const deleteSiemItem = (id, params) => {
  return transport.sendDelete(`${apiAppName}/${id}/`, params)
}
