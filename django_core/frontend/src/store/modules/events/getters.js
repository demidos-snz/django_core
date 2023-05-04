import { isNil, sortBy } from 'lodash'
import { Event } from '@/store/models/event'

export const getters = {
  packRetrieved: (state) => {
    return !isNil(state.packUuid)
  },

  events: (state) => {
    const events = sortBy(state.events, 'id', 'asc')
    return events.map((eventData) => new Event(eventData))
  },

  selectedSensor: (state, getters, rootState, rootGetters) => {
    const sensors = rootGetters['organizations/sensors']
    for (const sensor of sensors) {
      if (sensor.id === state.selectedSensorId) {
        return sensor
      }
    }
    return null
  },
}
