import { store } from '@/store'
import { getReportTypes, getReportStatuses, dateFormat } from '@/constants/constants'
import i18n from '@/translation'
import { AnonymousUser } from '@/store/models/user'
import { getFormattedDate } from '@/utils'

class Report {
  constructor(obj) {
    this.id = obj.id
    this.name = obj.name || ''
    this.stepId = obj.step
    this.organizationId = obj.organizationId
    this.createdRaw = obj.created
    this.dateFromRaw = obj.dateFrom
    this.dateToRaw = obj.dateTo
    this.authorId = obj.authorId || null
    this.statusId = obj.status
    this.file = obj.file
  }

  get stepData() {
    const types = getReportTypes()
    if (types.hasOwnProperty(this.stepId)) {
      return types[this.stepId]
    }
    return { name: i18n.t('main.unknown') }
  }

  get statusData() {
    const statuses = getReportStatuses()
    if (statuses.hasOwnProperty(this.statusId)) {
      return statuses[this.statusId]
    }
    return { name: i18n.t('main.unknown') }
  }

  get dateFrom() {
    return getFormattedDate(this.dateFromRaw, dateFormat)
  }

  get dateTo() {
    return getFormattedDate(this.dateToRaw, dateFormat)
  }

  get created() {
    return getFormattedDate(this.createdRaw)
  }

  get author() {
    if (!this.authorId) return null

    const storedUsers = store.getters['users/users']
    return storedUsers[this.authorId] || new AnonymousUser()
  }

  get organization() {
    if (!this.organizationId) return null

    const storedOrganizations = store.getters['organizations/organizations']
    return storedOrganizations[this.organizationId]
  }
}

export default Report
