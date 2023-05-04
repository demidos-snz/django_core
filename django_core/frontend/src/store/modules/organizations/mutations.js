import Vue from 'vue'
import { ORGANIZATION_TABS } from '@/constants/enums'

export const mutations = {
  SET_ORGANIZATIONS(state, organizations) {
    Vue.set(state, 'organizations', organizations)
  },

  SELECT_ORGANIZATION_TAB(state, tabId) {
    Vue.set(state, 'selectedOrganizationTab', tabId)
  },

  SELECT_ORGANIZATION_TAB_IN_ACTIVES(state, tabId) {
    Vue.set(state, 'selectedOrganizationTabInActives', tabId)
  },

  SELECT_STRUCTURE_SENSOR_ID(state, { segmentId, sensorId }) {
    Vue.set(state, 'selectedStructureSegmentId', segmentId)
    Vue.set(state, 'selectedStructureSensorId', sensorId)
    Vue.set(state, 'selectedStructureSiemId', null)
  },

  SELECT_STRUCTURE_SIEM_ID(state, { siemId }) {
    Vue.set(state, 'selectedStructureSiemId', siemId)
    Vue.set(state, 'selectedStructureSegmentId', null)
    Vue.set(state, 'selectedStructureSensorId', null)
  },

  ADD_ORGANIZATION(state, organization) {
    const index = state.organizations.findIndex((item) => organization.id === item.id)
    if (index >= 0) state.organizations.splice(index, 1)

    state.organizations.push(organization)
  },

  UPDATE_ORGANIZATION(state, organization) {
    const index = state.organizations.findIndex((item) => organization.id === item.id)

    if (index < 0) return

    const storedOrganization = state.organizations[index]
    const merged = { ...storedOrganization, ...organization }

    state.organizations.splice(index, 1)
    state.organizations.push(merged)
  },

  REMOVE_ORGANIZATION(state, organizationId) {
    const index = state.organizations.findIndex((item) => organizationId === item.id)
    state.organizations.splice(index, 1)
  },

  SELECT_ORGANIZATION_ID(state, organizationId) {
    Vue.set(state, 'selectedStructureSegmentId', null)
    Vue.set(state, 'selectedStructureSensorId', null)
    Vue.set(state, 'selectedOrganizationId', organizationId)
  },

  CHANGE_ONLY_ACTIVE_ORGANIZATIONS_FILTER(state) {
    const value = !state.onlyActiveOrganizations
    Vue.set(state, 'onlyActiveOrganizations', value)
  },

  CHANGE_ONLY_OCII_FILTER(state) {
    const value = !state.onlyOciiOrganizations
    Vue.set(state, 'onlyOciiOrganizations', value)
  },

  SELECT_ORGANIZATION_ID_IN_ACTIVES(state, organizationId) {
    Vue.set(state, 'selectedOrganizationIdInActives', organizationId)
  },

  CHANGE_ONLY_ACTIVE_ORGANIZATIONS_FILTER_IN_ACTIVES(state) {
    const value = !state.onlyActiveOrganizationsInActives
    Vue.set(state, 'onlyActiveOrganizationsInActives', value)
  },

  CHANGE_ONLY_OCII_FILTER_IN_ACTIVES(state) {
    const value = !state.onlyOciiOrganizationsInActives
    Vue.set(state, 'onlyOciiOrganizationsInActives', value)
  },

  SELECT_SEGMENT_ID_IN_NETWORKS(state, segmentId) {
    Vue.set(state, 'selectedSegmentIdInNetworks', segmentId)
  },

  SELECT_NETWORK_ID_IN_NODES(state, networkId) {
    Vue.set(state, 'selectedNetworkIdInNodes', networkId)
  },

  SET_SEGMENTS(state, segments) {
    Vue.set(state, 'segments', segments)
  },

  ADD_SEGMENT(state, segment) {
    const index = state.segments.findIndex((item) => segment.id === item.id)
    if (index >= 0) state.segments.splice(index, 1)

    state.segments.push(segment)
  },

  UPDATE_SEGMENT(state, segment) {
    const index = state.segments.findIndex((item) => segment.id === item.id)

    if (index < 0) return
    const storedSegment = state.segments[index]
    const merged = { ...storedSegment, ...segment }

    state.segments.splice(index, 1)
    state.segments.push(merged)
  },

  REMOVE_SEGMENT(state, segmentId) {
    const index = state.segments.findIndex((item) => segmentId === item.id)
    state.segments.splice(index, 1)
  },

  SET_SENSORS(state, sensors) {
    Vue.set(state, 'sensors', sensors)
  },

  ADD_SENSOR(state, sensor) {
    const index = state.sensors.findIndex((item) => sensor.id === item.id)
    if (index >= 0) state.sensors.splice(index, 1)

    state.sensors.push(sensor)
  },

  UPDATE_SENSOR(state, sensor) {
    const index = state.sensors.findIndex((item) => sensor.id === item.id)

    if (index < 0) return
    const storedSensor = state.sensors[index]
    const merged = { ...storedSensor, ...sensor }

    state.sensors.splice(index, 1)
    state.sensors.push(merged)
  },

  REMOVE_SENSOR(state, sensorId) {
    const index = state.sensors.findIndex((item) => sensorId === item.id)
    state.sensors.splice(index, 1)
  },

  SET_SIEMS(state, siems) {
    Vue.set(state, 'siems', siems)
  },

  ADD_SIEM(state, siem) {
    const index = state.siems.findIndex((item) => siem.id === item.id)
    if (index >= 0) state.siems.splice(index, 1)

    state.siems.push(siem)
  },

  UPDATE_SIEM(state, siem) {
    const index = state.siems.findIndex((item) => siem.id === item.id)

    if (index < 0) return
    const storedSiem = state.siems[index]
    const merged = { ...storedSiem, ...siem }

    state.siems.splice(index, 1)
    state.siems.push(merged)
  },

  REMOVE_SIEM(state, siemId) {
    const index = state.siems.findIndex((item) => siemId === item.id)
    state.siems.splice(index, 1)
  },

  SET_NCIRCCS(state, ncirccs) {
    Vue.set(state, 'ncirccs', ncirccs)
  },

  ADD_NCIRCC(state, ncircc) {
    const index = state.ncirccs.findIndex((item) => ncircc.id === item.id)
    if (index >= 0) state.ncirccs.splice(index, 1)

    state.ncirccs.push(ncircc)
  },

  UPDATE_NCIRCC(state, ncircc) {
    const index = state.ncirccs.findIndex((item) => ncircc.id === item.id)

    if (index < 0) return
    const storedNcircc = state.ncirccs[index]
    const merged = { ...storedNcircc, ...ncircc }

    state.ncirccs.splice(index, 1)
    state.ncirccs.push(merged)
  },

  REMOVE_NCIRCC(state, ncirccId) {
    const index = state.ncirccs.findIndex((item) => ncirccId === item.id)
    state.ncirccs.splice(index, 1)
  },

  SET_CONTACTS(state, contacts) {
    Vue.set(state, 'contacts', contacts)
  },

  ADD_CONTACT(state, contact) {
    const index = state.contacts.findIndex((item) => contact.id === item.id)
    if (index >= 0) state.contacts.splice(index, 1)

    state.contacts.push(contact)
  },

  UPDATE_CONTACT(state, contact) {
    const index = state.contacts.findIndex((item) => contact.id === item.id)

    if (index < 0) return
    const storedContacts = state.contacts[index]
    const merged = { ...storedContacts, ...contact }

    state.contacts.splice(index, 1)
    state.contacts.push(merged)
  },

  REMOVE_CONTACT(state, contactId) {
    const index = state.contacts.findIndex((item) => contactId === item.id)
    state.contacts.splice(index, 1)
  },

  SET_NETWORKS(state, networks) {
    Vue.set(state, 'networks', networks)
  },

  ADD_NETWORK(state, network) {
    const index = state.networks.findIndex((item) => network.id === item.id)
    if (index >= 0) state.networks.splice(index, 1)

    state.networks.push(network)
  },

  UPDATE_NETWORK(state, network) {
    const index = state.networks.findIndex((item) => network.id === item.id)

    if (index < 0) return
    const storedNetworks = state.networks[index]
    const merged = { ...storedNetworks, ...network }

    state.networks.splice(index, 1)
    state.networks.push(merged)
  },

  REMOVE_NETWORK(state, networkId) {
    const index = state.networks.findIndex((item) => networkId === item.id)
    state.networks.splice(index, 1)
  },

  SET_NODES(state, nodes) {
    Vue.set(state, 'nodes', nodes)
  },

  ADD_NODE(state, node) {
    const index = state.nodes.findIndex((item) => node.id === item.id)
    if (index >= 0) state.nodes.splice(index, 1)

    state.nodes.push(node)
  },

  UPDATE_NODE(state, node) {
    const index = state.nodes.findIndex((item) => node.id === item.id)

    if (index < 0) return
    const storedNodes = state.nodes[index]
    const merged = { ...storedNodes, ...node }

    state.nodes.splice(index, 1)
    state.nodes.push(merged)
  },

  REMOVE_NODES(state, nodeId) {
    const index = state.nodes.findIndex((item) => nodeId === item.id)
    state.nodes.splice(index, 1)
  },

  SET_OPERATING_SYSTEMS(state, operatingSystems) {
    Vue.set(state, 'operatingSystems', operatingSystems)
  },

  ADD_OPERATING_SYSTEM(state, operatingSystem) {
    const index = state.operatingSystems.findIndex((item) => operatingSystem.id === item.id)
    if (index >= 0) state.operatingSystems.splice(index, 1)

    state.operatingSystems.push(operatingSystem)
  },

  UPDATE_OPERATING_SYSTEM(state, operatingSystem) {
    const index = state.operatingSystems.findIndex((item) => operatingSystem.id === item.id)

    if (index < 0) return
    const storedOperatingSystems = state.operatingSystems[index]
    const merged = { ...storedOperatingSystems, ...operatingSystem }

    state.operatingSystems.splice(index, 1)
    state.operatingSystems.push(merged)
  },

  REMOVE_OPERATING_SYSTEM(state, operatingSystemId) {
    const index = state.operatingSystems.findIndex((item) => operatingSystemId === item.id)
    state.operatingSystems.splice(index, 1)
  },

  SET_PROCESSED_DATA_TYPES(state, processedDataTypes) {
    Vue.set(state, 'processedDataTypes', processedDataTypes)
  },

  ADD_PROCESSED_DATA_TYPE(state, processedDataType) {
    const index = state.processedDataTypes.findIndex((item) => processedDataType.id === item.id)
    if (index >= 0) state.processedDataTypes.splice(index, 1)

    state.processedDataTypes.push(processedDataType)
  },

  UPDATE_PROCESSED_DATA_TYPE(state, processedDataType) {
    const index = state.processedDataTypes.findIndex((item) => processedDataType.id === item.id)

    if (index < 0) return
    const storedProcessedDataTypes = state.processedDataTypes[index]
    const merged = { ...storedProcessedDataTypes, ...processedDataType }

    state.processedDataTypes.splice(index, 1)
    state.processedDataTypes.push(merged)
  },

  REMOVE_PROCESSED_DATA_TYPE(state, processedDataTypeId) {
    const index = state.processedDataTypes.findIndex((item) => processedDataTypeId === item.id)
    state.processedDataTypes.splice(index, 1)
  },

  RESET(state) {
    Vue.set(state, 'organizations', [])
    Vue.set(state, 'segments', [])
    Vue.set(state, 'sensors', [])
    Vue.set(state, 'siems', [])
    Vue.set(state, 'selectedOrganizationTab', ORGANIZATION_TABS.MAIN)
    Vue.set(state, 'selectedOrganizationId', null)
    Vue.set(state, 'onlyActiveOrganizations', false)
    Vue.set(state, 'onlyOciiOrganizations', false)
    Vue.set(state, 'selectedStructureSensorId', null)
    Vue.set(state, 'selectedStructureSegmentId', null)
  },
}
