import {
  getIncidentStatuses,
  getSeverityLevels,
  getIncidentTypes,
  getNotificationStatusItems,
  getIncidentVerdictTypes,
} from '@/constants/constants'
import { store } from '@/store'
import { isNil, orderBy } from 'lodash'
import { HistoryAction } from '@/store/models/history_action'
import { Comment } from '@/store/models/comment'
import { Attachment } from '@/store/models/attachment'
import { Event } from '@/store/models/event'
import Recommendation from '@/store/models/recommendation'
import ActionTaken from '@/store/models/action_taken'
import { AnonymousUser } from '@/store/models/user'
import i18n from '@/translation/index'
import { NCIRCC_NOTIFICATION_STATUS } from '@/constants/enums'
import Ncircc from '@/store/models/ncircc'
import { getFormattedDate } from '@/utils'

class Incident {
  constructor(obj) {
    this.id = obj.id
    this.organizationId = obj.organizationId || null
    this.hrid = obj.hrid || ''
    this.name = obj.name || ''
    this.severityLevelId = obj.severityLevel || null
    this.typeIncident = obj.typeIncident || null
    this.status = obj.status || null
    this.assignedId = obj.assignedId || null
    this.fixationDatetimeRaw = obj.fixationDatetime || ''
    this.registrationDatetimeRaw = obj.registrationDatetime || ''
    this.lastModifiedDatetimeRaw = obj.lastModifiedDatetime || ''
    this.lastViewedByClientRaw = obj.datetimeOfLastViewingByClient || null
    this.transmissionDatetimeRaw = obj.transmissionDatetime || null
    this.closedDatetimeRaw = obj.closedDatetime || null

    this.description = obj.description || ''
    this.confirmed = obj.confirmed
    this.authorId = obj.authorId
    this.cmLine = obj.cmLine
    this.ncirccRegNumber = obj.ncirccRegNumber
    this.ncirccStatusId = obj.ncirccStatus
    const notification = store.state.incidents.ncircc || {}
    this.ncircc = new Ncircc(this, notification)
    this.lastComment = obj.lastComment
    this.verdictId = obj.verdict
    this.verdictReasonId = obj.verdictReason
  }

  get segments() {
    const segments = []
    const sensors = this.sensors

    sensors.forEach((sensor) => {
      sensor.segments.forEach((segment) => {
        if (!segments.some((item) => item.id === segment.id)) {
          segments.push(segment)
        }
      })
    })

    return segments
  }

  get sensors() {
    const sensors = []
    const events = this.events

    events.forEach((event) => {
      if (!sensors.some((item) => item.id === event.sensorId)) {
        sensors.push(event.sensor)
      }
    })

    return sensors
  }

  get assigned() {
    if (isNil(this.assignedId)) return null

    const storedUsers = store.getters['users/users']
    return storedUsers[this.assignedId] || new AnonymousUser()
  }

  get author() {
    const storedUsers = store.getters['users/users']
    return storedUsers[this.authorId] || new AnonymousUser()
  }

  get organization() {
    if (isNil(this.organizationId)) return null
    const storedOrganizations = store.getters['organizations/organizations']
    return storedOrganizations[this.organizationId] || null
  }

  get lastViewedByClient() {
    return getFormattedDate(this.lastViewedByClientRaw)
  }

  get transmissionDatetime() {
    return getFormattedDate(this.transmissionDatetimeRaw)
  }

  get fixationDatetime() {
    return getFormattedDate(this.fixationDatetimeRaw)
  }

  get registrationDatetime() {
    return getFormattedDate(this.registrationDatetimeRaw)
  }

  get lastModifiedDatetime() {
    return getFormattedDate(this.lastModifiedDatetimeRaw)
  }

  get closedDatetime() {
    return getFormattedDate(this.closedDatetimeRaw)
  }

  get statusData() {
    const statuses = getIncidentStatuses()
    if (statuses.hasOwnProperty(this.status)) {
      return statuses[this.status]
    }
    return { alias: i18n.t('main.unknown'), color: '#9E9E9E' }
  }

  get severityLevel() {
    const levels = getSeverityLevels()

    if (levels.hasOwnProperty(this.severityLevelId)) {
      return levels[this.severityLevelId]
    }
    return { name: i18n.t('main.unknown'), color: '#B0BEC5' }
  }

  get typeData() {
    return getIncidentTypes().find((item) => item.id === this.typeIncident) || { name: i18n.t('main.unknown') }
  }

  get availableOperators() {
    const storedUsers = store.getters['users/users']
    const stateAvailableOperators = store.state.incidents.availableOperators
    const availableOperators = []

    stateAvailableOperators.forEach((operatorId) => {
      if (storedUsers.hasOwnProperty(operatorId)) {
        availableOperators.push(storedUsers[operatorId])
      }
    })

    return availableOperators
  }

  get historyActions() {
    const historyActions = store.state.incidents.historyActions
    const mappedActions = historyActions.map((action) => new HistoryAction(action))
    return orderBy(mappedActions, 'id, desc')
  }

  get comments() {
    const comments = store.state.incidents.comments
    const mappedComments = comments.map((comment) => new Comment(comment))
    return orderBy(mappedComments, 'id, asc')
  }

  get attachments() {
    const attachments = store.state.incidents.attachments
    const mappedAttachments = attachments.map((attachment) => new Attachment(attachment))
    return orderBy(mappedAttachments, 'id, desc')
  }

  get affectedActives() {
    return []
  }

  get iocs() {
    return []
  }

  get events() {
    const events = store.state.incidents.events
    const mappedEvents = events.map((event) => new Event(event))
    return orderBy(mappedEvents, 'id, desc')
  }

  hasRecommendations() {
    return this.recommendations.length > 0
  }

  get recommendations() {
    const recommendations = store.state.incidents.recommendations
    const mappedRecommendations = recommendations.map((recommendation) => new Recommendation(recommendation))
    return orderBy(mappedRecommendations, 'id, asc')
  }

  get usedRecommendationSamples() {
    return this.recommendations.map((recommendation) => recommendation.sampleId)
  }

  get usedActionTakenSamples() {
    return this.actionsTaken.map((actionTaken) => actionTaken.sampleId)
  }

  hasActionsTaken() {
    return this.actionsTaken.length > 0
  }

  get actionsTaken() {
    const actionsTaken = store.state.incidents.actionsTaken
    const mappedActions = actionsTaken.map((action) => new ActionTaken(action))
    return orderBy(mappedActions, 'id, asc')
  }

  get submittedToNcircc() {
    return this.ncircc.submitted
  }

  get ncirccNeedMoreInfo() {
    return this.ncircc.status === NCIRCC_NOTIFICATION_STATUS.SUPPLEMENT_REQUIRED
  }

  get ncirccStatus() {
    for (const item of getNotificationStatusItems()) {
      if (item.id === this.ncirccStatusId) {
        return item.name
      }
    }
    return '-'
  }

  get verdict() {
    if (this.verdictId) {
      const verdictTypes = getIncidentVerdictTypes()

      if (verdictTypes.hasOwnProperty(this.verdictId)) {
        return verdictTypes[this.verdictId]
      }
    }

    return null
  }

  get verdictReason() {
    if (this.verdictReasonId) {
      const verdictReasons = store.state.incidents.verdictReasons

      return verdictReasons.find((reason) => reason.id === this.verdictReasonId)
    }

    return null
  }
}

export default Incident
