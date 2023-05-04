import { sortBy } from 'lodash'
import { store } from '@/store'

class OrganizationNcircc {
  constructor(obj) {
    this.id = obj.id
    this.organizationName = obj.organizationName || ''
    this.sphere = obj.sphere || null
    this.typeSubject = obj.typeSubject || null
    this.federalDistrict = obj.federalDistrict || null
    this.address = obj.address || ''
    this.okogu = obj.okogu || ''
    this.okopf = obj.okopf || ''
    this.inn = obj.inn || ''
    this.kpp = obj.kpp || ''
    this.ocii = obj.ocii || null
    this.organizationId = obj.organizationId || null
  }

  get contacts() {
    const storedContacts = store.getters['organizations/contacts']
    const contacts = storedContacts.reduce((results, contact) => {
      if (contact.ncircc === this.id) results.push(contact)
      return results
    }, [])

    return sortBy(contacts, 'id')
  }
}

export default OrganizationNcircc
