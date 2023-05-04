import { store } from '@/store'
import i18n from '@/translation'
import { getUserRoles } from '@/constants/constants'
import { ROLE, PASSWORD_STATUS } from '@/constants/enums'
import { isNil } from 'lodash'
import moment from 'moment'

class User {
  constructor(obj) {
    this.id = obj.id
    this.name = obj.name || ''
    this.surname = obj.surname || ''
    this.patronymic = obj.patronymic || ''
    this.email = obj.email || ''
    this.phone = obj.phone || ''
    this.role = obj.role
    this.isActive = obj.isActive || false
    this.isStaff = obj.isStaff || false
    this.privateEmail = obj.privateEmail
    this.telegramChatId = obj.telegramChatId
    this.passwordStatus = obj.passwordStatus || null
    this.passwordExpirationRaw = obj.passwordExpiration
  }

  get fullName() {
    return `${this.surname} ${this.name} ${this.patronymic}`
  }

  get organizations() {
    const storedOrganizations = Object.values(store.getters['organizations/organizations'])
    return storedOrganizations.filter((organization) => organization.userIds.includes(this.id))
  }

  get hasNccciOrganizations() {
    return this.organizations.some((organization) => organization.isOcii)
  }

  get organizationIds() {
    return this.organizations.map((organization) => organization.id)
  }

  get roleLocalized() {
    const key = getUserRoles()[this.role].alias
    return i18n.t(`users.roles.${key}`)
  }

  get isSuperuser() {
    return this.role === ROLE.SUPERUSER
  }

  get isClient() {
    return [ROLE.CLIENT, ROLE.CLIENT_OF_FIRST_LINE].includes(this.role)
  }

  get passwordExpiration() {
    if (!isNil(this.passwordExpirationRaw)) {
      const datetime = moment(this.passwordExpirationRaw)
      return datetime.format('YYYY-MM-DD HH:mm')
    }
    return null
  }

  get passwordIsObsolete() {
    return this.passwordStatus === PASSWORD_STATUS.OBSOLETE
  }

  get passwordIsOutdated() {
    return this.passwordStatus === PASSWORD_STATUS.OUTDATED
  }
}

export default User

export class AnonymousUser extends User {
  constructor(name) {
    super({ id: null, name: name || i18n.t('main.hidden_user') })
  }

  get roleLocalized() {
    return i18n.t(`main.hidden_user`)
  }
}
