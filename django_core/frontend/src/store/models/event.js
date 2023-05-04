import { isNil } from 'lodash'
import { store } from '@/store'
import { getFormattedDate } from '@/utils'

export class Event {
  constructor(data) {
    this.uuid = data.uuid
    this.sensorId = data.sensorId
    this.sid = data.sid
    this.id = data.id
    this.siemEventId = data.siemEventId
    this.data = data.data
    this.nestedEvents = data.mpEvents
  }

  get deviceReceiptTime() {
    return getFormattedDate(this.data.deviceReceiptTime)
  }

  get name() {
    return this.data.name
  }

  get description() {
    return this.data.description
  }

  get severity() {
    return this.data.severity
  }

  get destinationAddress() {
    return this.data.destinationAddress
  }

  get destinationHostName() {
    return this.data.destinationHostName
  }

  get key() {
    return this.data.key
  }

  get sourceAddress() {
    return this.data.sourceAddress
  }

  get sourceHostName() {
    return this.data.sourceHostName
  }

  get sensor() {
    if (isNil(this.sensorId)) {
      return null
    }

    const sensors = store.getters['organizations/sensors']

    return sensors.find((sensor) => sensor.id === this.sensorId) || null
  }
}
