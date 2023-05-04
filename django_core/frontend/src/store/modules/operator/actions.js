import { changePassword, getCurrentUser, loginUser, logoutUser } from '@/api/auth'
import { isNil, isArray } from 'lodash'
import router from '@/router'
import i18n from '@/translation'
import { updateUserNotificationSettings } from '@/api/auth'

export const actions = {
  async init({ dispatch }) {
    const [error, response] = await getCurrentUser()
    if (isNil(error) && response.status === 200) {
      dispatch('setLoggedIn', true)
    } else {
      const routeName = router.currentRoute.name
      if (!['password_change', 'login'].includes(routeName)) {
        router.push({ name: 'login' })
      }
    }
  },

  setNotificationSettings({ commit }, settings) {
    commit('SET_NOTIFICATION_SETTINGS', settings)
  },

  setSettings({ commit }, settings) {
    commit('SET_SETTINGS', settings)
  },

  setUser({ commit }, data) {
    commit('SET_USER', data)
  },

  update({ commit, state }, data) {
    const current = { ...state.user, ...data }
    commit('SET_USER', current)
  },

  setLoggedIn({ commit }, isLogged) {
    commit('SET_LOGGED_IN', isLogged)
  },

  async loginUser({ dispatch }, params) {
    const [error, response] = await loginUser(params)
    if (isNil(error) && response.status === 200) {
      dispatch('setLoggedIn', true)
    } else {
      const data = error.response.data
      let message

      if (data.email) {
        message = data.email[0]
      } else if (data.detail) {
        message = isArray(data.detail) ? data.detail[0] : data.detail
      }

      message = message || i18n.t('main.request_error')

      dispatch('alerts/addAlert', { type: 'error', message }, { root: true })
    }
  },

  async logoutUser({ dispatch }) {
    const [error, response] = await logoutUser()
    if (isNil(error) && response.status === 200) {
      dispatch('resetStateData')
    }
  },

  changePassword(context, { email, oldPassword, newPassword1, newPassword2 }) {
    return changePassword({ email, oldPassword, newPassword1, newPassword2 })
  },

  setPasswordStatus({ commit }, passwordStatus) {
    commit('SET_PASSWORD_STATUS', passwordStatus)
  },

  clearAuthData({ commit }) {
    commit('CLEAR_USER_DATA')
  },

  resetStateData({ commit }) {
    commit('CLEAR_USER_DATA')
    commit('alerts/RESET', null, { root: true })
    commit('events/RESET', null, { root: true })
    commit('incidents/UNLOAD_INCIDENT_DATA', null, { root: true })
    commit('incidents/RESET', null, { root: true })
    commit('organizations/RESET', null, { root: true })
    commit('permissions/RESET', null, { root: true })
    commit('ui/RESET', null, { root: true })
    commit('users/RESET', null, { root: true })
    commit('socket/RESET', null, { root: true })
  },

  updateUserNotificationsSettings(context, params) {
    return updateUserNotificationSettings(params)
  },
}
