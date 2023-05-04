import { addEventsToIncident, getEvents, getPackEvents, removeIncidentEvent, removeTmpEvents } from '@/api/events'
import { isNil } from 'lodash'
import i18n from '@/translation'

export const actions = {
  setSelectedSensorId({ commit, dispatch }, sensorId) {
    dispatch('resetEventsPackData').then(() => {
      commit('SET_SELECTED_SENSOR_ID', sensorId)
    })
  },

  setSelectedSiemId({ commit, dispatch }, siemId) {
    dispatch('resetEventsPackData').then(() => {
      commit('SET_SELECTED_SENSOR_ID', null)
      commit('SET_SELECTED_SIEM_ID', siemId)
    })
  },

  setLoading({ commit }, loading) {
    commit('SET_LOADING', loading)
  },

  resetEventsPackData({ commit, state }) {
    if (!isNil(state.packUuid)) {
      const packUuid = state.packUuid
      removeTmpEvents({ packUuid }).then()
    }
    commit('RESET_PACK_DATA')
  },

  prepareEventsPack({ state, commit, rootState }, params) {
    params.incidentId = rootState.incidents.incidentData.id
    params.siemId = state.selectedSiemId
    params.sensorId = state.selectedSensorId

    return getEvents(params).then((data) => {
      const [error, response] = data
      if (isNil(error) && response.status === 200) {
        commit('STORE_PACK_DATA', response.data)
      }
    })
  },

  loadEvents({ commit, state, dispatch }) {
    const params = {
      page: state.page,
      perPage: state.totalItems,
      packUuid: state.packUuid,
    }

    if (params.perPage === 0) {
      return dispatch('setLoading', false)
    }

    getPackEvents(params)
      .then((data) => {
        const [error, response] = data
        if (isNil(error) && response.status === 200) {
          if (response.data.length === 10000) {
            const message = i18n.t('dialogs.eventSelection.event_quantity_warning')
            dispatch('alerts/addAlert', { type: 'warning', message }, { root: true })
          }

          commit('STORE_EVENTS', response.data)
        }
      })
      .finally(() => {
        dispatch('setLoading', false)
      })
  },

  fetchEvents({ getters, dispatch }, params) {
    dispatch('setLoading', true)

    if (!getters.packRetrieved) {
      dispatch('prepareEventsPack', params).then(() => {
        dispatch('loadEvents')
      })
    } else {
      dispatch('loadEvents')
    }
  },

  addEventsToIncident({ state, rootState }, params) {
    params = {
      packUuid: state.packUuid,
      incidentId: rootState.incidents.incidentData.id,
      siemId: state.selectedSiemId,
      sensorId: state.selectedSensorId,
      ...params,
    }
    return addEventsToIncident(params)
  },

  removeIncidentEvent({ rootState }, eventId) {
    const incidentId = rootState.incidents.incidentData.id
    return removeIncidentEvent({ incidentId, eventId })
  },
}
