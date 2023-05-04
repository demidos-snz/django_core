import { keyBy, isNil } from 'lodash'

class NotificationsManager {
  constructor(settings) {
    this.settings = keyBy(settings, 'organizationId')
  }

  getValue(organizationId, messageCode, channel) {
    if (isNil(messageCode)) {
      return this.getTelegramValue(organizationId)
    }

    if (!this.settings.hasOwnProperty(organizationId)) {
      return false
    }

    const organizationConfig = this.settings[organizationId].settings
    if (!organizationConfig.hasOwnProperty(messageCode)) {
      return false
    }

    return organizationConfig[messageCode].includes(channel)
  }

  getTelegramValue(organizationId) {
    return ['newIncident', 'updatedIncident', 'closedIncident'].every((item) =>
      this.getValue(organizationId, item, 'telegram')
    )
  }
}

export default NotificationsManager
