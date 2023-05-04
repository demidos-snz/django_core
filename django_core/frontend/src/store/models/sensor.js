import { ORGANIZATION_STRUCTURE_ITEM_TYPES } from '@/constants/enums'
import { sortBy, isNil } from 'lodash'
import { store } from '@/store'

class Sensor {
  constructor(obj) {
    this.id = obj.id
    this.name = obj.name || ''
    this.identifier = obj.identifier || ''
    this.address = obj.address || ''
    this.url = obj.url || ''
    this.homeNet = obj.homeNet || ''
    this.typeSensor = obj.typeSensor | ''
    this.login = obj.login || ''
    this.password = obj.password | ''
    this.segmentIds = obj.segments || []
    this.type = ORGANIZATION_STRUCTURE_ITEM_TYPES.SENSOR
    this.currentSegment = null
    this.isActive = obj.isActive
  }

  get itemKey() {
    const ownKey = `${this.type}${this.id}`
    if (isNil(this.currentSegment)) {
      return ownKey
    }

    return `${this.currentSegment.itemKey}_${ownKey}`
  }

  get segments() {
    const storedSegments = store.getters['organizations/segments']
    const segments = storedSegments.reduce((results, segment) => {
      if (this.segmentIds.includes(segment.id)) results.push(segment)
      return results
    }, [])

    return sortBy(segments, 'id')
  }
}

export default Sensor
