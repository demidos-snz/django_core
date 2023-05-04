import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import Vue from 'vue'
import { isUndefined } from 'lodash'
import moment from 'moment'
import { datetimeFormat } from '@/constants/constants'

export const connectSentry = (version) => {
  const __serverMode = process.env.NODE_ENV
  const __sentryDSN = process.env.VUE_APP_SENTRY_DSN

  if (__serverMode === 'production') {
    if (__sentryDSN) {
      Sentry.init({
        dsn: __sentryDSN,
        integrations: [new Integrations.Vue({ Vue, attachProps: true })],
        release: version,
        environment: __serverMode,
        attachStacktrace: true,
        debug: true,
      })
      /* eslint-disable no-console */
      console.log('Функционирование с Sentry.')
    } else if (__sentryDSN === '' || __sentryDSN === undefined) {
      console.log('SENTRY_DSN не установлен. Функционирование без Sentry.')
    } else {
      console.warn('SENTRY_DSN установлен в некорректное значение. Функционирование без Sentry.')
    }
  }
}

export const getChanges = (fieldName, changesObj, sourceObj) => {
  if (!changesObj) changesObj = {}
  return isUndefined(changesObj[fieldName]) ? sourceObj[fieldName] : changesObj[fieldName]
}

export const buildTree = (rawArray) => {
  const struct = {}
  const tree = []

  rawArray.forEach((item) => {
    struct[item.id] = { ...item, children: [] }
  })

  rawArray.forEach((item) => {
    if (item.parentId) {
      struct[item.parentId].children.push(struct[item.id])
    } else {
      tree.push(struct[item.id])
    }
  })
  return tree
}

export const getFormattedDate = (rawValue, format = datetimeFormat) => {
  if (rawValue) {
    const date = moment(rawValue)
    if (date.isValid()) {
      const formattedDate = date.format(format)
      if (formattedDate !== 'Invalid date') {
        return formattedDate
      }
    }
  }

  return '-'
}
