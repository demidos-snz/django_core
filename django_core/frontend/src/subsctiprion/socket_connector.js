import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'
import { socketOptions } from '@/socket.config'

export function getSubscriptionUrl() {
  let hostUrl = window.location.host
  const isProduction = process.env.NODE_ENV === 'production'

  if (process.env.VUE_APP_SERVER_URL && !isProduction) {
    hostUrl = process.env.VUE_APP_SERVER_URL
  }

  return '//' + hostUrl + '/ws/v2/'
}

export function prepareWSConnection() {
  Vue.use(VueNativeSock, getSubscriptionUrl(), socketOptions)
}
