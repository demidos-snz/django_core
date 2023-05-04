import i18n from '@/translation/index'
import { store } from '@/store'
import router from '@/router'
import { isArray } from 'lodash'

export default function to(promise, handleStatus = true) {
  return promise
    .then((data) => {
      return [null, data]
    })
    .catch((error) => {
      if (!handleStatus) {
        return [error, null]
      }

      let message = error.response && error.response.data.detail
      if (isArray(message)) {
        message = message[0]
      }

      switch (error.response.status) {
        case 400:
        case 500:
          message = message || i18n.t('main.request_error')
          store['dispatch']('alerts/addAlert', { type: 'error', message })
          break
        case 403:
          message = message || i18n.t('main.permissions_denied')
          store['dispatch']('alerts/addAlert', { type: 'error', message })
          break
        case 401:
          store['dispatch']('operator/resetStateData')
          router.push('/login').then()
          break
      }

      return [error, null]
    })
}
