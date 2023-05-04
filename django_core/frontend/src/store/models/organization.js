import { isNil, sortBy } from 'lodash'
import { store } from '@/store'
import { getFormattedDate } from '@/utils'
import { dateFormat } from '@/constants/constants'

class Organization {
  constructor(obj) {
    this.id = obj.id
    this.parentId = obj.parentId
    this.parentName = obj.parentName
    this.name = obj.name || ''
    this.shortName = obj.shortName || ''
    this.hrid = obj.hrid
    this.contractDateRaw = obj.contractDate
    this.contractDuration = obj.contractDuration
    this.userIds = obj.users
    this.siemIds = obj.siems
    this.modifiedRaw = obj.modified
    this.createdRaw = obj.created
    this.isActive = obj.isActive
    this.isOcii = obj.isOcii
    this.externalIpToIm = obj.externalIpToIm
    this.contract = obj.contract || ''
    this.email = obj.email || ''
    this.firstLineCm = obj.firstLineCm
    this.tiasOrganizationId = obj.tiasOrganizationId
    this.monitoringMode = obj.monitoringMode
    this.address = obj.address
    this.inactivatedRaw = obj.inactivated
  }

  get nameVerbose() {
    if (!this.parentId) {
      return this.name
    }
    const parent = this.parent

    if (!isNil(parent)) {
      return `${parent.name}: ${this.name}`
    }

    return this.name
  }

  get contractDate() {
    return getFormattedDate(this.contractDateRaw, dateFormat)
  }

  get modified() {
    return getFormattedDate(this.modifiedRaw)
  }

  get created() {
    return getFormattedDate(this.createdRaw)
  }

  get inactivated() {
    return getFormattedDate(this.inactivatedRaw)
  }

  get parent() {
    if (!this.parentId) return null
    const storedOrganizations = Object.values(store.getters['organizations/organizations'])
    const parent = storedOrganizations.find((organization) => organization.id === this.parentId)
    return parent || null
  }

  get users() {
    const storedUsers = store.getters['users/users']
    const users = []

    this.userIds.forEach((id) => {
      if (storedUsers.hasOwnProperty(id)) {
        users.push(storedUsers[id])
      }
    })

    return users
  }

  get siems() {
    const storedSiems = Object.values(store.getters['organizations/siems'])
    const siems = storedSiems.filter((siem) => this.siemIds.includes(siem.id))

    return sortBy(siems, 'id')
  }

  get segments() {
    const storedSegments = store.getters['organizations/segments']
    const segments = storedSegments.filter((segment) => segment.organizationId === this.id)

    return sortBy(segments, 'id')
  }

  get headId() {
    const parent = this.parent
    if (parent) {
      return parent.headId
    }
    return this.id
  }

  get ncircc() {
    const storedNcirccs = store.getters['organizations/ncirccs']
    return storedNcirccs[this.id]
  }
}

export default Organization
