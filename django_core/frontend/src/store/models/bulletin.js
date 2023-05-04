import moment from 'moment'
import { store } from '@/store'
import { getBulletinTypes, dateFormat } from '@/constants/constants'
import i18n from '@/translation'
import { AnonymousUser } from '@/store/models/user'
import BulletinView from '@/store/models/bulletinView'
import { keyBy, isNil } from 'lodash'

class Bulletin {
  constructor(obj) {
    this.id = obj.id
    this.name = obj.name
    this.number = obj.number
    this.typeId = obj.typeBulletin
    this.dateRaw = obj.date
    this.authorId = obj.userId
    this.viewsRaw = obj.views
    this.downloadDatetimeRaw = obj.downloadDatetime
    this.markReadDatetimeRaw = obj.markReadDatetime
    this.isNccci = obj.isNccci
  }

  get downloaded() {
    return !isNil(this.downloadDatetimeRaw)
  }

  get read() {
    return !isNil(this.markReadDatetimeRaw)
  }

  get type() {
    const types = getBulletinTypes()
    if (types.hasOwnProperty(this.typeId)) {
      return types[this.typeId].name
    }
    return { name: i18n.t('main.unknown') }
  }

  get date() {
    const date = moment(this.dateRaw)
    return date.isValid() ? date.format(dateFormat) : null
  }

  get author() {
    if (!this.authorId) return null

    const storedUsers = store.getters['users/users']
    return storedUsers[this.authorId] || new AnonymousUser()
  }

  get hasReads() {
    return Boolean(this.views.length)
  }

  get views() {
    const storedUsers = store.getters['users/users']
    let clients = Object.values(storedUsers).filter((user) => user.isClient)

    if (this.isNccci) {
      clients = clients.filter((client) => client.hasNccciOrganizations)
    }

    const viewsByUserMap = keyBy(this.viewsRaw, 'userId')
    return clients.map((user) => {
      if (viewsByUserMap.hasOwnProperty(user.id)) {
        return new BulletinView(viewsByUserMap[user.id])
      }
      return new BulletinView({ userId: user.id })
    })
  }
}

export default Bulletin
