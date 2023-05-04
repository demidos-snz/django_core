import { store } from '@/store'
import { AnonymousUser } from '@/store/models/user'
import { getFormattedDate } from '@/utils'

export class Evidence {
  constructor(data, anonymousName) {
    this.id = data.id
    this.createdRaw = data.created
    this.incidentId = data.incidentId
    this.file = data.file
    this.name = data.name
    this.description = data.description
    this.source = data.source
    this.userId = data.userId
    this.anonymousName = anonymousName
  }

  get user() {
    return store.getters['users/users'][this.userId] || new AnonymousUser(this.anonymousName)
  }

  get created() {
    return getFormattedDate(this.createdRaw)
  }
}
