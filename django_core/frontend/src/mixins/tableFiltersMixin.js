import {
  getSeverityLevels,
  getIncidentTypes,
  getIncidentStatuses,
  getReportTypes,
  getReportStatuses,
  getBulletinTypes,
  getNotificationStatusItems,
} from '@/constants/constants'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('operator', ['operator']),
  },
  methods: {
    getFilters(table) {
      let result = {}
      const key = `${table}Filters${this.operator.id}`
      const data = localStorage[key]
      if (data) {
        result = JSON.parse(data)
      }
      return result
    },
    getTableFilterInputData(type, table) {
      if (table === 'incidents') {
        switch (type) {
          case 'organization':
            return Object.values(this.organizations).map((item) => ({ id: item.id, name: item.nameVerbose }))
          case 'severity_level':
            return Object.values(getSeverityLevels())
          case 'type_incident':
            return getIncidentTypes()
          case 'status':
            return Object.values(getIncidentStatuses())
          case 'assigned':
          case 'author':
            return Object.values(this.users).map((item) => ({ id: item.id, name: item.fullName }))
          case 'ncircc_notification__status': {
            return getNotificationStatusItems()
          }
          default:
            return []
        }
      } else if (table === 'reports') {
        switch (type) {
          case 'organization':
            return Object.values(this.organizations).map((item) => ({ id: item.id, name: item.nameVerbose }))
          case 'step':
            return Object.values(getReportTypes())
          case 'author':
            return Object.values(this.users).map((item) => ({ id: item.id, name: item.fullName }))
          case 'status':
            return Object.values(getReportStatuses())
          default:
            return []
        }
      } else if (table === 'bulletins') {
        switch (type) {
          case 'typeBulletin':
            return Object.values(getBulletinTypes())
          default:
            return []
        }
      }
    },
  },
}
