import { isNil, orderBy } from 'lodash'
import { getNotificationStatusItems } from '@/constants/constants'
import { store } from '@/store'
import { NcirccComment } from '@/store/models/comment'
import { Evidence } from '@/store/models/evidence'
import i18n from '@/translation'
import { getFormattedDate } from '@/utils'

class Ncircc {
  constructor(incident, data) {
    this.id = data.id
    this.incident = incident
    this.authorId = data.authorId
    this.uuid = data.uuid
    this.registrationNumber = data.regNumber
    this.data = data.data
    this.createdRaw = data.created
    this.modifiedRaw = data.modified
    this.status = data.status

    if (!isNil(this.data)) {
      for (const key in this.data) {
        if (this.data.hasOwnProperty(key)) {
          if (!this.constructor.prototype.hasOwnProperty(key)) {
            this[key] = this.data[key]
          }
        }
      }
    }
  }

  get assistance() {
    if (!isNil(this.data)) {
      return this.data.assistance
    }

    return false
  }

  get created() {
    return getFormattedDate(this.createdRaw)
  }

  get modified() {
    return getFormattedDate(this.modifiedRaw)
  }

  get statusVerbose() {
    for (const item of getNotificationStatusItems()) {
      if (item.id === this.status) {
        return item.name
      }
    }
    return '-'
  }

  get submitted() {
    return Boolean(this.uuid)
  }

  get comments() {
    const comments = store.state.incidents.ncirccComments
    const mappedComments = comments.map((comment) => new NcirccComment(comment))
    return orderBy(mappedComments, 'created, asc')
  }

  get evidences() {
    const evidences = store.state.incidents.ncirccEvidences
    const mappedEvidences = evidences.map((evidence) => new Evidence(evidence, i18n.t('ncircc.operator')))
    return orderBy(mappedEvidences, 'created, asc')
  }
}

export default Ncircc
