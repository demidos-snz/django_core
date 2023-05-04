import { isNil } from 'lodash'
import { store } from '@/store'
import { AnonymousUser } from '@/store/models/user'
import { datetimeFormatWithSec } from '@/constants/constants'
import { getFormattedDate } from '@/utils'

class BulletinView {
  constructor(obj) {
    this.id = obj.id
    this.userId = obj.userId
    this.downloadDatetimeRaw = obj.downloadDatetime || null
    this.markReadDatetimeRaw = obj.markReadDatetime || null
  }

  get user() {
    const storedUsers = store.getters['users/users']
    return storedUsers[this.userId] || new AnonymousUser()
  }

  get isDownloaded() {
    return !isNil(this.downloadDatetimeRaw)
  }

  get isMarkedAsRead() {
    return !isNil(this.markReadDatetimeRaw)
  }

  get downloadDateTime() {
    return getFormattedDate(this.downloadDatetimeRaw, datetimeFormatWithSec)
  }

  get markReadDateTime() {
    return getFormattedDate(this.markReadDatetimeRaw, datetimeFormatWithSec)
  }
}

export default BulletinView
