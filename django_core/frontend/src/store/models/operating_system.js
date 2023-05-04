class OperatingSystem {
  constructor(obj) {
    this.id = obj.id
    this.name = obj.name || ''
    this.version = obj.version || ''
    this.subversion = obj.subversion || ''
    this.linuxDistributive = obj.linuxDistributive || ''
  }
}

export default OperatingSystem
