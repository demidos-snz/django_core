import Vue from 'vue'
import Vuex from 'vuex'
import { socket } from '@/store/modules/socket'
import { operator } from '@/store/modules/operator'
import { permissions } from '@/store/modules/permissions'
import { ui } from '@/store/modules/ui'
import { organizations } from '@/store/modules/organizations'
import { users } from '@/store/modules/users'
import { incidents } from '@/store/modules/incidents'
import { alerts } from '@/store/modules/alerts'
import { events } from '@/store/modules/events'
import { reports } from '@/store/modules/reports'
import { bulletins } from '@/store/modules/bulletins'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    socket,
    operator,
    permissions,
    ui,
    organizations,
    users,
    incidents,
    alerts,
    events,
    reports,
    bulletins,
  },
})
