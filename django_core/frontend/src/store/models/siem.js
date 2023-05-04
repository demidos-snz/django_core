import { store } from '@/store'
import { SIEM_TYPES } from '@/constants/enums'

class Siem {
  constructor(obj) {
    this.id = obj.id
    this.address = obj.address || ''
    this.name = obj.name || ''
    this.url = obj.url || ''
    this.login = obj.login || ''
    this.password = obj.password || ''
    this.identifier = obj.identifier || ''
    this.typeSiem = obj.typeSiem || ''
    this.isSync = obj.isSync || false
    this.organizationIds = obj.organizations
  }

  get itemKey() {
    return `${this.typeSiem}${this.id}`
  }

  get organizations() {
    const storedOrganizations = Object.values(store.getters['organizations/organizations'])
    return this.organizationIds.reduce((results, id) => {
      if (storedOrganizations.hasOwnProperty(id)) results.push(storedOrganizations[id])
      return results
    }, [])
  }

  get type() {
    return this.typeSiem.charAt(0).toUpperCase() + this.typeSiem.slice(1)
  }

  get isTias() {
    return this.typeSiem === SIEM_TYPES.TIAS
  }
}

export default Siem
