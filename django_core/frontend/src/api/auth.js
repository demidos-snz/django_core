import transport from '@/api/utils/transport'

const apiAppName = 'accounts'

export const getCurrentUser = () => {
  return transport.sendGet(`${apiAppName}/me/`, {}, false)
}

export const loginUser = (params) => {
  return transport.sendPost(`${apiAppName}/login/`, params, false)
}
export const logoutUser = () => {
  return transport.sendPost(`${apiAppName}/logout/`)
}

export const changePassword = ({ email, oldPassword, newPassword1, newPassword2 }) => {
  return transport.sendPost(`${apiAppName}/password/change/`, { email, oldPassword, newPassword1, newPassword2 })
}

export const updateUserNotificationSettings = ({ organizationId, channel, ...rest }) => {
  const params = {
    organizationId,
    channel,
    messageTypes: rest,
  }
  return transport.sendPatch(`users/notifications/`, params)
}

export const getQrCode = () => {
  return transport.sendGet(`${apiAppName}/getqr/`)
}
