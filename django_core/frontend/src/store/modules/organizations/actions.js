import { createOrganizationItem, updateOrganizationItem, updateOrganizationItemSiems } from '@/api/organization'
import { createSiemItem, updateSiemItem } from '@/api/siem'
import { createSensorItem, updateSensorItem, updateSensorItemSegments } from '@/api/sensor'
import { createSegmentItem, updateSegmentItem, deleteSegmentItem } from '@/api/segment'
import { createNcirccItem, updateNcirccItem } from '@/api/organization_ncircc'
import { createContactItem, updateContactItem, deleteContactItem } from '@/api/organization_ncircc_contact'
import { createNetworkItem, updateNetworkItem, deleteNetworkItem } from '@/api/network'
import { createNodeItem, updateNodeItem, deleteNodeItem } from '@/api/node'
import { isNil } from 'lodash'

export const actions = {
  setOrganizations({ commit }, organizations) {
    commit('SET_ORGANIZATIONS', organizations)
  },

  addOrganization({ commit }, organization) {
    commit('ADD_ORGANIZATION', organization)
  },

  updateOrganization({ commit }, organization) {
    commit('UPDATE_ORGANIZATION', organization)
  },

  removeOrganization({ commit }, organizationId) {
    commit('REMOVE_ORGANIZATION', organizationId)
  },

  selectOrganizationId({ commit }, organizationId) {
    commit('SELECT_ORGANIZATION_ID', organizationId)
  },

  deselectOrganizationId({ commit }) {
    commit('SELECT_ORGANIZATION_ID', null)
  },

  selectOrganizationIdInActives({ commit, dispatch }, organizationId) {
    commit('SELECT_ORGANIZATION_ID_IN_ACTIVES', organizationId)
    dispatch('deselectSegmentIdInNetworks')
    dispatch('deselectNetworkIdInNodes')
  },

  deselectOrganizationIdInActives({ commit }) {
    commit('SELECT_ORGANIZATION_ID_IN_ACTIVES', null)
  },

  selectOrganizationTab({ commit }, tabId) {
    commit('SELECT_ORGANIZATION_TAB', tabId)
  },

  selectOrganizationTabInActives({ commit }, tabId) {
    commit('SELECT_ORGANIZATION_TAB_IN_ACTIVES', tabId)
  },

  selectStructureSegmentId({ commit }, { segmentId }) {
    commit('SELECT_STRUCTURE_SENSOR_ID', { segmentId, sensorId: null })
  },

  selectStructureSensorId({ commit }, { sensorId, segmentId }) {
    commit('SELECT_STRUCTURE_SENSOR_ID', { segmentId, sensorId })
  },

  selectStructureSiemId({ commit }, { siemId }) {
    commit('SELECT_STRUCTURE_SIEM_ID', { siemId })
  },

  deselectStructureItemData({ commit }) {
    commit('SELECT_STRUCTURE_SENSOR_ID', { sensorId: null, segmentId: null })
    commit('SELECT_STRUCTURE_SIEM_ID', { siemId: null })
  },

  changeOnlyActiveOrganizationsFilter({ commit }) {
    commit('CHANGE_ONLY_ACTIVE_ORGANIZATIONS_FILTER')
  },

  changeOnlyOciiOrganizationsFilter({ commit }) {
    commit('CHANGE_ONLY_OCII_ORGANIZATIONS_FILTER')
  },

  changeOnlyActiveOrganizationsFilterInActives({ commit }) {
    commit('CHANGE_ONLY_ACTIVE_ORGANIZATIONS_FILTER_IN_ACTIVES')
  },

  changeOnlyOciiOrganizationsFilterInActives({ commit }) {
    commit('CHANGE_ONLY_OCII_ORGANIZATIONS_FILTER_IN_ACTIVES')
  },

  selectSegmentIdInNetworks({ commit, dispatch }, segmentId) {
    commit('SELECT_SEGMENT_ID_IN_NETWORKS', segmentId)
    dispatch('deselectNetworkIdInNodes')
  },

  deselectSegmentIdInNetworks({ commit, dispatch }) {
    commit('SELECT_SEGMENT_ID_IN_NETWORKS', null)
    dispatch('deselectNetworkIdInNodes')
  },

  selectNetworkIdInNodes({ commit }, networkId) {
    commit('SELECT_NETWORK_ID_IN_NODES', networkId)
  },

  deselectNetworkIdInNodes({ commit }) {
    commit('SELECT_NETWORK_ID_IN_NODES', null)
  },

  setSegments({ commit }, segments) {
    commit('SET_SEGMENTS', segments)
  },

  addSegment({ commit }, segment) {
    commit('ADD_SEGMENT', segment)
  },

  updateSegment({ commit }, segment) {
    commit('UPDATE_SEGMENT', segment)
  },

  removeSegment({ commit }, segmentId) {
    commit('REMOVE_SEGMENT', segmentId)
  },

  setSensors({ commit }, sensors) {
    commit('SET_SENSORS', sensors)
  },

  addSensor({ commit }, sensor) {
    commit('ADD_SENSOR', sensor)
  },

  updateSensor({ commit }, sensor) {
    commit('UPDATE_SENSOR', sensor)
  },

  removeSensor({ commit }, sensorId) {
    commit('REMOVE_SENSOR', sensorId)
  },

  setSiems({ commit }, siems) {
    commit('SET_SIEMS', siems)
  },

  addSiem({ commit }, siem) {
    commit('ADD_SIEM', siem)
  },

  updateSiem({ commit }, siem) {
    commit('UPDATE_SIEM', siem)
  },

  removeSiem({ commit }, siemId) {
    commit('REMOVE_SIEM', siemId)
  },

  setNcirccs({ commit }, ncirccs) {
    commit('SET_NCIRCCS', ncirccs)
  },

  addNcircc({ commit }, ncircc) {
    commit('ADD_NCIRCC', ncircc)
  },

  updateNcircc({ commit }, ncircc) {
    commit('UPDATE_NCIRCC', ncircc)
  },

  removeNcircc({ commit }, ncirccId) {
    commit('REMOVE_NCIRCC', ncirccId)
  },

  setContacts({ commit }, contacts) {
    commit('SET_CONTACTS', contacts)
  },

  addContact({ commit }, contact) {
    commit('ADD_CONTACT', contact)
  },

  updateContact({ commit }, contact) {
    commit('UPDATE_NCIRCC', contact)
  },

  removeContact({ commit }, contactId) {
    commit('REMOVE_CONTACT', contactId)
  },

  setNetworks({ commit }, networks) {
    commit('SET_NETWORKS', networks)
  },

  addNetwork({ commit }, network) {
    commit('ADD_NETWORK', network)
  },

  updateNetwork({ commit }, network) {
    commit('UPDATE_NETWORK', network)
  },

  removeNetwork({ commit }, networkId) {
    commit('REMOVE_NETWORK', networkId)
  },

  setNodes({ commit }, nodes) {
    commit('SET_NODES', nodes)
  },

  addNode({ commit }, node) {
    commit('ADD_NODE', node)
  },

  updateNode({ commit }, node) {
    commit('UPDATE_NODE', node)
  },

  removeNode({ commit }, nodeId) {
    commit('REMOVE_NODE', nodeId)
  },

  setOperatingSystems({ commit }, operatingSystems) {
    commit('SET_OPERATING_SYSTEMS', operatingSystems)
  },

  addOperatingSystem({ commit }, operatingSystem) {
    commit('ADD_OPERATING_SYSTEM', operatingSystem)
  },

  updateOperatingSystem({ commit }, operatingSystem) {
    commit('UPDATE_OPERATING_SYSTEM', operatingSystem)
  },

  removeOperatingSystem({ commit }, operatingSystemId) {
    commit('REMOVE_OPERATING_SYSTEM', operatingSystemId)
  },

  setProcessedDataTypes({ commit }, processedDataTypes) {
    commit('SET_PROCESSED_DATA_TYPES', processedDataTypes)
  },

  addProcessedDataType({ commit }, processedDataType) {
    commit('ADD_PROCESSED_DATA_TYPE', processedDataType)
  },

  updateProcessedDataType({ commit }, processedDataType) {
    commit('UPDATE_PROCESSED_DATA_TYPE', processedDataType)
  },

  removeProcessedDataType({ commit }, processedDataTypeId) {
    commit('REMOVE_PROCESSED_DATA_TYPE', processedDataTypeId)
  },

  async createOrganizationInstance({ dispatch }, params) {
    const [error, response] = await createOrganizationItem(params)

    if (isNil(error) && response.status === 201) {
      dispatch('selectOrganizationId', response.data.id)
    }

    return [error, response]
  },

  async updateOrganizationInstance(context, { id, params }) {
    const [error, response] = await updateOrganizationItem(id, params)
    return [error, response]
  },

  async updateOrganizationInstanceSiems(context, { id, params }) {
    const [error, response] = await updateOrganizationItemSiems(id, params)
    return [error, response]
  },

  async createSiemInstance(context, params) {
    const [error, response] = await createSiemItem(params)
    return [error, response]
  },

  async updateSiemInstance(context, { id, params }) {
    const [error, response] = await updateSiemItem(id, params)
    return [error, response]
  },

  async createSensorInstance({ dispatch }, params) {
    const [error, response] = await createSensorItem(params)

    if (!error && response.status === 201) {
      const data = response.data
      dispatch('selectStructureSensorId', {
        sensorId: data.id,
        segmentId: data.segments[0],
      })
    }

    return [error, response]
  },

  async updateSensorInstance(context, { id, params }) {
    const [error, response] = await updateSensorItem(id, params)
    return [error, response]
  },

  async createSegmentInstance(context, params) {
    const [error, response] = await createSegmentItem(params)
    return [error, response]
  },

  async updateSegmentInstance(context, { id, params }) {
    const [error, response] = await updateSegmentItem(id, params)
    return [error, response]
  },

  async deleteSegmentInstance(context, segmentId) {
    await deleteSegmentItem(segmentId)
  },

  async updateSensorInstanceSegments(context, { id, params }) {
    const [error, response] = await updateSensorItemSegments(id, params)
    return [error, response]
  },

  async createNcirccInstance(context, params) {
    const [error, response] = await createNcirccItem(params)
    return [error, response]
  },

  async updateNcirccInstance(context, { id, params }) {
    const [error, response] = await updateNcirccItem(id, params)
    return [error, response]
  },

  async createContactInstance(context, params) {
    const [error, response] = await createContactItem(params)
    return [error, response]
  },

  async updateContactInstance(context, { id, params }) {
    const [error, response] = await updateContactItem(id, params)
    return [error, response]
  },

  async deleteContactInstance(context, contactId) {
    await deleteContactItem(contactId)
  },

  async createNetworkInstance(context, params) {
    const [error, response] = await createNetworkItem(params)
    return [error, response]
  },

  async updateNetworkInstance(context, { id, params }) {
    const [error, response] = await updateNetworkItem(id, params)
    return [error, response]
  },

  async deleteNetworkInstance(context, networkId) {
    await deleteNetworkItem(networkId)
  },

  async createNodeInstance(context, params) {
    const [error, response] = await createNodeItem(params)
    return [error, response]
  },

  async updateNodeInstance(context, { id, params }) {
    const [error, response] = await updateNodeItem(id, params)
    return [error, response]
  },

  async deleteNodeInstance(context, nodeId) {
    await deleteNodeItem(nodeId)
  },
}
