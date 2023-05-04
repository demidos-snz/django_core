import Incident from '@/store/models/incident'
import { isNil, keyBy } from 'lodash'
import RecommendationSample from '@/store/models/recommendation_sample'
import ActionTakenSample from '@/store/models/action_taken_sample'
import ActionTaken from '@/store/models/action_taken'

export const getters = {
  incidents: (state) => {
    return state.incidents.map((incident) => new Incident(incident))
  },

  currentIncident: (state) => {
    const incidentData = state.incidentData
    if (isNil(incidentData)) {
      return null
    }

    return new Incident(incidentData)
  },

  actionsTaken: (state) => {
    return state.actionsTaken.map((action) => new ActionTaken(action))
  },

  recommendationSamples: (state) => {
    return keyBy(
      state.recommendationSamples.map((sample) => new RecommendationSample(sample)),
      'id'
    )
  },

  actionsTakenSamples: (state) => {
    return keyBy(
      state.actionsTakenSamples.map((sample) => new ActionTakenSample(sample)),
      'id'
    )
  },
}
