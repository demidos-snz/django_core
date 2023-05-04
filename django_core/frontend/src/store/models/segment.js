import { ORGANIZATION_STRUCTURE_ITEM_TYPES } from '@/constants/enums'
import { store } from '@/store'
import { sortBy } from 'lodash'
import Sensor from '@/store/models/sensor'

class Segment {
  constructor(obj) {
    this.id = obj.id
    this.organizationId = obj.organizationId || null
    this.name = obj.name || ''
    this.type = ORGANIZATION_STRUCTURE_ITEM_TYPES.SEGMENT
    this.itemKey = `${this.type + this.id}`
    this.sensorIds = obj.sensorIds
    this.isOcii = obj.isOcii
    this.internetAccess = obj.internetAccess
  }

  get sensors() {
    const storedSensors = store.state.organizations.sensors
    const sensors = []

    storedSensors.forEach((item) => {
      if (this.sensorIds.includes(item.id)) {
        const sensor = new Sensor(item)
        sensor.currentSegment = this
        sensors.push(sensor)
      }
    })

    return sortBy(sensors, 'id')
  }

  get networks() {
    const storedNetworks = store.getters['organizations/networks']
    const networks = storedNetworks.reduce((results, network) => {
      if (network.segmentId === this.id) results.push(network)
      return results
    }, [])

    return sortBy(networks, 'id')
  }
}

export default Segment
