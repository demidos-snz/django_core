import Vue from 'vue'
import App from './components/App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './translation/index'
import { store } from '@/store'
import { prepareWSConnection } from '@/subsctiprion/socket_connector'

Vue.config.productionTip = false

store.dispatch('operator/init')
prepareWSConnection()

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
