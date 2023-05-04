class OrganizationNcirccContact {
  constructor(obj) {
    this.id = obj.id
    this.name = obj.name || ''
    this.email = obj.email || null
    this.phone = obj.phone || null
    this.ncircc = obj.ncircc || null
  }
}

export default OrganizationNcirccContact
