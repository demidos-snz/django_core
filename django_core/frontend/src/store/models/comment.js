import { store } from '@/store'
import { AnonymousUser } from '@/store/models/user'
import i18n from '@/translation'

export class Comment {
  constructor(data, anonymousName) {
    this.id = data.id
    this.createdRaw = data.created
    this.incidentId = data.incidentId
    this.text = data.text
    this.userId = data.userId
    this.anonymousName = anonymousName
  }

  get user() {
    return store.getters['users/users'][this.userId] || new AnonymousUser(this.anonymousName)
  }

  get createdDatetime() {
    return new Date(this.createdRaw)
  }
}

export class NcirccComment extends Comment {
  constructor(data) {
    let anonymousName = i18n.t('ncircc.operator')
    if (data.isImUserAuthor) {
      anonymousName = i18n.t('main.im_operator')
    }

    super(data, anonymousName)
    this.isImUserAuthor = data.isImUserAuthor
  }
}
