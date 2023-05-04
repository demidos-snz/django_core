import { store } from '@/store'
import { AnonymousUser } from '@/store/models/user'

class Recommendation {
  constructor(obj) {
    this.id = obj.id
    this.confirmed = obj.confirmed
    this.created = new Date(obj.created)
    this.incidentId = obj.incidentId
    this.sampleId = obj.sampleId
    this.userId = obj.userId
    this.order = obj.order
  }

  get user() {
    return store.getters['users/users'][this.userId] || new AnonymousUser()
  }

  get sample() {
    return store.getters['incidents/recommendationSamples'][this.sampleId]
  }

  get text() {
    return (this.sample && this.sample.text) || ''
  }
}

export default Recommendation
