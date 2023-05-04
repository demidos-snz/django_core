import moment from 'moment'
import { store } from '@/store'

class Node {
  constructor(obj) {
    this.id = obj.id
    this.operatingSystem = obj.operatingSystem || {}
    this.processedDataType = obj.processedDataType || {}
    this.createdRaw = obj.created
    this.modifiedRaw = obj.modified
    this.macAddress = obj.macAddress || ''
    this.privateIpAddress = obj.privateIpAddress || ''
    this.publicIpAddress = obj.publicIpAddress || ''
    this.internetAccess = obj.internetAccess
    this.isOcii = obj.isOcii
    this.processedDataSecrecy = obj.processedDataSecrecy
    this.informationSource = obj.informationSource || ''
    this.criticality = obj.criticality
    this.estimatedCost = obj.estimatedCost || ''
    this.hostname = obj.hostname || ''
    this.geoAddress = obj.geoAddress || ''
    this.networkId = obj.network
  }

  get created() {
    const date = moment(this.createdRaw)
    return date.isValid() ? date : null
  }

  get modified() {
    const date = moment(this.modifiedRaw)
    return date.isValid() ? date : null
  }

  get network() {
    const storedNetworks = store.getters['organizations/networks']
    return storedNetworks.find((network) => network.id === this.networkId) || null
  }
}

export default Node
