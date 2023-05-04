import transport from '@/api/utils/transport'

const apiAppName = 'users'

export const createUserItem = ({ name, surname, patronymic, password1, password2, email, phone, role }) => {
  return transport.sendPost(`${apiAppName}/`, { name, surname, patronymic, password1, password2, email, phone, role })
}

export const updateUserItem = (id, params) => {
  return transport.sendPatch(`${apiAppName}/${id}/`, params)
}

export const deleteUserItem = (id, params) => {
  return transport.sendDelete(`${apiAppName}/${id}/`, params)
}

export const updateUserItemOrganizations = (id, params) => {
  return transport.sendPut(`${apiAppName}/${id}/organizations/`, params)
}
