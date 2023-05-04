import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'

const namespaced = true
const state = {
  // incidents page
  incidents: [],
  page: 1,
  itemsPerPage: 10,
  isLoading: false,
  totalItems: 0,
  searchText: '',

  sortBy: 'id',
  sortDesc: false,
  filters: {},
  displayedColumns: [
    'hrid',
    'name',
    'organization',
    'severity_level',
    'type_incident',
    'assigned',
    'status',
    'ncircc_notification__reg_number',
    'ncircc_notification__status',
    'registration_datetime',
    'closed_datetime',
  ],

  //incident page
  incidentLoading: false,
  incidentData: null,
  recommendationSamples: [],
  recommendations: [],
  actionsTakenSamples: [],
  actionsTaken: [],
  historyActions: [],
  comments: [],
  attachments: [],
  availableOperators: [],
  events: [],
  verdictReasons: [],

  // ncircc
  ncircc: null,
  ncirccComments: [],
  ncirccEvidences: [],
}
export const incidents = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
}
