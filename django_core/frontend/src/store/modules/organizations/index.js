import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'
import { ORGANIZATION_TABS, ORGANIZATION_TABS_IN_ACTIVES } from '@/constants/enums'

const namespaced = true
const state = {
  organizations: [],
  segments: [],
  sensors: [],
  siems: [],
  ncirccs: [],
  contacts: [],
  networks: [],
  nodes: [],
  operatingSystems: [],
  processedDataTypes: [],
  selectedOrganizationTab: ORGANIZATION_TABS.MAIN,
  selectedOrganizationId: null,
  onlyActiveOrganizations: false,
  onlyOciiOrganizations: false,
  selectedOrganizationTabInActives: ORGANIZATION_TABS_IN_ACTIVES.SEGMENTS,
  selectedOrganizationIdInActives: null,
  onlyActiveOrganizationsInActives: false,
  onlyOciiOrganizationsInActives: false,
  selectedSegmentIdInNetworks: null,
  selectedNetworkIdInNodes: null,
  selectedStructureSensorId: null,
  selectedStructureSegmentId: null,
  selectedStructureSiemId: null,
}
export const organizations = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
}
