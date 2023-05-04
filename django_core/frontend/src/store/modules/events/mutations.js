import Vue from 'vue'

export const mutations = {
  STORE_PACK_DATA(state, { packUuid, eventsCount }) {
    if (eventsCount > 0) {
      Vue.set(state, 'packUuid', packUuid)
      Vue.set(state, 'totalItems', eventsCount)
    }
  },

  RESET_PACK_DATA(state) {
    Vue.set(state, 'packUuid', null)
    Vue.set(state, 'events', [])
    Vue.set(state, 'totalItems', 0)
    Vue.set(state, 'page', 1)
  },

  STORE_EVENTS(state, events) {
    Vue.set(state, 'events', events)
  },

  SET_LOADING(state, loading) {
    Vue.set(state, 'loading', loading)
  },

  SET_SELECTED_SENSOR_ID(state, sensorId) {
    Vue.set(state, 'selectedSensorId', sensorId)
  },

  SET_SELECTED_SIEM_ID(state, siemId) {
    Vue.set(state, 'selectedSiemId', siemId)
  },

  RESET(state) {
    Vue.set(state, 'events', [])
    Vue.set(state, 'selectedSensorId', null)
    Vue.set(state, 'selectedSiemId', null)
    Vue.set(state, 'packUuid', null)
    Vue.set(state, 'totalItems', 0)
    Vue.set(state, 'page', 1)
    Vue.set(state, 'perPage', 15)
    Vue.set(state, 'loading', false)
  },
}
