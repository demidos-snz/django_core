import Vue from 'vue'

export const mutations = {
  SET_USER(state, data) {
    Vue.set(state, 'user', data)
  },

  SET_PASSWORD_STATUS(state, passwordStatus) {
    Vue.set(state.user, 'passwordStatus', passwordStatus)
  },

  SET_SETTINGS(state, settings) {
    Vue.set(state, 'settings', settings)
  },

  SET_NOTIFICATION_SETTINGS(state, settings) {
    Vue.set(state.settings, 'notifications', settings)
  },

  SET_LOGGED_IN(state, isLogged) {
    Vue.set(state, 'isLogged', isLogged)
  },

  CLEAR_USER_DATA(state) {
    Vue.set(state, 'user', null)
    Vue.set(state, 'isLogged', false)
  },
}
