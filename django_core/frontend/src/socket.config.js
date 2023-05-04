import camelcaseKeys from 'camelcase-keys'
import { store } from '@/store'

export const socketOptions = {
  store,
  format: 'json',
  connectManually: true,
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 15, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 5000, // (Number) how long to initially wait before attempting a new (1000)
  passToStoreHandler: function (eventName, event) {
    if (!eventName.startsWith('SOCKET_')) {
      return
    }

    const method = 'dispatch'
    let target = eventName
    let msg = event

    if (this.format === 'json' && event.data) {
      msg = JSON.parse(event.data)
      target = 'SOCKET_' + msg.event
    }

    let data
    if (msg.data) {
      data = camelcaseKeys(msg.data, { deep: true })
    } else {
      data = msg
    }

    this.store[method](`socket/${target}`, data)
  },
}
