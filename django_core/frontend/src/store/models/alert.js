import { store } from '@/store'
import { common } from '@/constants/constants'
import { isNil, isUndefined } from 'lodash'
import { ALERT_TYPES } from '@/constants/enums'
import { marked } from 'marked'

class Alert {
  constructor(obj) {
    this.id = Math.random().toString(36).substring(2, 7)
    this.type = obj.type
    this.message = obj.message
    this.title = obj.title || null
    this.extraData = obj.extra || {}
    this.expiring = isUndefined(this.extraData.expiring) ? true : Boolean(this.extraData.expiring)
    this.callbackData = this.extraData.callbackData || null
    this.timer = 0
    this.interval = null
    this.paused = true
    this.confirmed = false
    this.buffer = common.alertBuffer
    this.timeout = common.alertTimeout
  }

  get markdownText() {
    return marked(this.message)
  }

  get progress() {
    return this.timer * (this.buffer / this.timeout)
  }

  start() {
    if (this.expiring) {
      this.paused = false
      this.interval = setInterval(() => {
        this.timer += 100 / 1000
        if (this.timer > this.timeout) {
          store.dispatch('alerts/deleteAlert', this.id, { root: true })
          clearInterval(this.interval)
        }
      }, 100)
    }
  }

  pause() {
    this.paused = true
    clearInterval(this.interval)
  }

  confirmAndClose() {
    this.confirm(true)
    this.close()
  }

  close() {
    if (this.needConfirmation && this.confirmed) {
      store.dispatch('socket/notification_closed', this.callbackData, { root: true })
    }
    store.dispatch('alerts/deleteAlert', this.id, { root: true })
    clearInterval(this.interval)
  }

  get isDialog() {
    return this.extraData.dialogType === ALERT_TYPES.DIALOG
  }

  get needConfirmation() {
    return !isNil(this.callbackData)
  }

  confirm(confirmed) {
    this.confirmed = confirmed
  }
}

export default Alert
