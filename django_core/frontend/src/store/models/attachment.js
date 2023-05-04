import { store } from '@/store'
import { AnonymousUser } from '@/store/models/user'

export class Attachment {
  constructor(data) {
    this.id = data.id
    this.createdRaw = data.created
    this.incidentId = data.incidentId
    this.userId = data.userId
    this.description = data.description
    this.name = data.name
    this.file = data.file
  }

  get user() {
    return store.getters['users/users'][this.userId] || new AnonymousUser()
  }

  get createdDatetime() {
    return new Date(this.createdRaw)
  }
}
