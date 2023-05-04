import { store } from '@/store'
import { AnonymousUser } from '@/store/models/user'
import i18n from '@/translation'
import { HISTORY_ACTIONS } from '@/constants/enums'
import { getIncidentStatuses, getIncidentTypes, getSeverityLevels } from '@/constants/constants'
import { getFormattedDate } from '@/utils'

export class HistoryAction {
  constructor(data) {
    this.id = data.id
    this.createdRaw = data.created
    this.incidentId = data.incidentId
    this.action = data.action
    this._prevValue = data.prevValue
    this._newValue = data.newValue
    this.userId = data.userId
  }

  get user() {
    return store.getters['users/users'][this.userId] || new AnonymousUser()
  }

  get createdDatetime() {
    return getFormattedDate(this.createdRaw)
  }

  get prevValue() {
    switch (this.action) {
      case HISTORY_ACTIONS.STATUS_CHANGED:
        return getIncidentStatuses()[this._prevValue].name
      case HISTORY_ACTIONS.TYPE_CHANGED:
        return (
          getIncidentTypes().find((item) => item.id === Number.parseInt(this._prevValue)) || {
            name: i18n.t('main.unknown'),
          }
        ).name
      case HISTORY_ACTIONS.SEVERITY_LEVEL_CHANGED:
        return getSeverityLevels()[this._prevValue].name
      default:
        return this._prevValue
    }
  }

  get newValue() {
    switch (this.action) {
      case HISTORY_ACTIONS.STATUS_CHANGED:
        return getIncidentStatuses()[this._newValue].name
      case HISTORY_ACTIONS.TYPE_CHANGED:
        return (
          getIncidentTypes().find((item) => item.id === Number.parseInt(this._newValue)) || {
            name: i18n.t('main.unknown'),
          }
        ).name
      case HISTORY_ACTIONS.SEVERITY_LEVEL_CHANGED:
        return getSeverityLevels()[this._newValue].name
      default:
        return this._newValue
    }
  }

  get text() {
    if (this.action === 'events_added') {
      return i18n.tc(`incidents.historyActions.events_added`, this.newValue)
    }

    return i18n.t(`incidents.historyActions.${this.action}`, {
      prevValue: this.prevValue,
      newValue: this.newValue,
    })
  }
}
