import transport from '@/api/utils/transport'
const apiAppName = 'contacts'

export const createContactItem = ({ name, email, phone, ncirccId }) => {
  return transport.sendPost(`${apiAppName}/`, {
    name,
    email,
    phone,
    ncirccId,
  })
}

export const updateContactItem = (id, params) => {
  return transport.sendPatch(`${apiAppName}/${id}/`, params)
}

export const deleteContactItem = (id, params) => {
  return transport.sendDelete(`${apiAppName}/${id}/`, params)
}
