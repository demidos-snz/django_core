import snakecaseKeys from 'snakecase-keys'
import { incidentActions } from '@/store/modules/socket/incident_actions'

function getSendFunction(socket, getters) {
  return function sendObj(obj) {
    obj = snakecaseKeys(obj)
    if (getters.websocketOpened) {
      return socket.send(JSON.stringify(obj))
    }

    const sendInterval = setInterval(() => {
      if (getters.websocketOpened) {
        socket.send(JSON.stringify(obj))
        clearInterval(sendInterval)
      }
    }, 200)
  }
}

export const actions = {
  SOCKET_onopen({ getters, commit }, event) {
    const socket = event.currentTarget
    socket.sendObj = getSendFunction(socket, getters)
    this.$socket = socket

    commit('SOCKET_OPENED')
  },

  SOCKET_RECONNECT({ commit }) {
    commit('SOCKET_RECONNECTION')
  },

  SOCKET_onerror() {},

  SOCKET_RECONNECT_ERROR() {},

  SOCKET_onclose({ commit }) {
    commit('SOCKET_CLOSED')
  },

  SOCKET_pong() {
    // heartbeat response
  },

  ping() {
    // heartbeat request
    const params = {
      event: 'ping',
      data: {},
    }
    this.$socket.sendObj(params)
  },

  ...incidentActions,

  SOCKET_user_data({ dispatch }, data) {
    dispatch('operator/setUser', data, { root: true })
  },

  SOCKET_user_settings({ dispatch }, { settings, notificationSettings }) {
    dispatch('operator/setSettings', settings, { root: true })
    dispatch('operator/setNotificationSettings', notificationSettings, { root: true })
  },

  SOCKET_password_status({ dispatch }, passwordStatus) {
    dispatch('operator/setPasswordStatus', passwordStatus, { root: true })
  },

  SOCKET_role_model({ dispatch }, { model }) {
    dispatch('permissions/storeRoleModel', model, { root: true })
  },

  SOCKET_organizations({ dispatch }, { organizations }) {
    dispatch('organizations/setOrganizations', organizations, { root: true })
  },

  SOCKET_organization_added({ dispatch }, organization) {
    dispatch('organizations/addOrganization', organization, { root: true })
  },

  SOCKET_organization_updated({ dispatch }, organization) {
    dispatch('organizations/updateOrganization', organization, { root: true })
  },

  SOCKET_organization_removed({ dispatch }, { organizationId }) {
    dispatch('organizations/removeOrganization', organizationId, { root: true })
  },

  SOCKET_users({ dispatch }, { users }) {
    dispatch('users/setUsers', users, { root: true })
  },

  SOCKET_user_added({ dispatch }, user) {
    dispatch('users/addUser', user, { root: true })
  },

  SOCKET_user_updated({ rootState, dispatch }, user) {
    dispatch('users/updateUser', user, { root: true })

    if (rootState.operator.isLogged) {
      if (rootState.operator.user.id === user.id) {
        dispatch('operator/update', user, { root: true })
      }
    }
  },

  SOCKET_user_removed({ dispatch }, { userId }) {
    dispatch('users/removeUser', userId, { root: true })
  },

  SOCKET_segments({ dispatch }, { segments }) {
    dispatch('organizations/setSegments', segments, { root: true })
  },

  SOCKET_segment_added({ dispatch }, segment) {
    dispatch('organizations/addSegment', segment, { root: true })
  },

  SOCKET_segment_updated({ dispatch }, segment) {
    dispatch('organizations/updateSegment', segment, { root: true })
  },

  SOCKET_segment_removed({ dispatch }, { segmentId }) {
    dispatch('organizations/removeSegment', segmentId, { root: true })
  },

  SOCKET_sensors({ dispatch }, { sensors }) {
    dispatch('organizations/setSensors', sensors, { root: true })
  },

  SOCKET_sensor_added({ dispatch }, sensor) {
    dispatch('organizations/addSensor', sensor, { root: true })
  },

  SOCKET_sensor_updated({ dispatch }, sensor) {
    dispatch('organizations/updateSensor', sensor, { root: true })
  },

  SOCKET_sensor_removed({ dispatch }, { sensorId }) {
    dispatch('organizations/removeSensor', sensorId, { root: true })
  },

  SOCKET_siems({ dispatch }, { siems }) {
    dispatch('organizations/setSiems', siems, { root: true })
  },

  SOCKET_siem_added({ dispatch }, siem) {
    dispatch('organizations/addSiem', siem, { root: true })
  },

  SOCKET_siem_updated({ dispatch }, siem) {
    dispatch('organizations/updateSiem', siem, { root: true })
  },

  SOCKET_siem_removed({ dispatch }, { siemId }) {
    dispatch('organizations/removeSiem', siemId, { root: true })
  },

  SOCKET_report_added({ dispatch }) {
    dispatch('reports/loadReports', null, { root: true })
  },

  SOCKET_report_updated({ dispatch }, report) {
    dispatch('reports/updateReport', report, { root: true })
  },

  SOCKET_report_removed({ dispatch }) {
    dispatch('reports/loadReports', null, { root: true })
  },

  SOCKET_has_new_bulletins({ dispatch }, { newBulletins }) {
    dispatch('bulletins/setHasNewBulletins', newBulletins, { root: true })
  },

  SOCKET_bulletin_added({ dispatch }) {
    dispatch('bulletins/loadBulletins', null, { root: true })
  },

  SOCKET_bulletin_updated({ dispatch }, report) {
    dispatch('bulletins/updateBulletin', report, { root: true })
  },

  SOCKET_bulletin_removed({ dispatch }) {
    dispatch('bulletins/loadBulletins', null, { root: true })
  },

  SOCKET_ncircc({ dispatch }, { ncircc }) {
    dispatch('organizations/setNcirccs', ncircc, { root: true })
  },

  SOCKET_ncircc_added({ dispatch }, ncircc) {
    dispatch('organizations/addNcircc', ncircc, { root: true })
  },

  SOCKET_ncircc_updated({ dispatch }, ncircc) {
    dispatch('organizations/updateNcircc', ncircc, { root: true })
  },

  SOCKET_ncircc_removed({ dispatch }, { ncirccId }) {
    dispatch('organizations/removeNcircc', ncirccId, { root: true })
  },

  SOCKET_contacts({ dispatch }, { contacts }) {
    dispatch('organizations/setContacts', contacts, { root: true })
  },

  SOCKET_contact_added({ dispatch }, contact) {
    dispatch('organizations/addContact', contact, { root: true })
  },

  SOCKET_contact_updated({ dispatch }, contact) {
    dispatch('organizations/updateContact', contact, { root: true })
  },

  SOCKET_contact_removed({ dispatch }, { contactId }) {
    dispatch('organizations/removeContact', contactId, { root: true })
  },

  SOCKET_networks({ dispatch }, { networks }) {
    dispatch('organizations/setNetworks', networks, { root: true })
  },

  SOCKET_network_added({ dispatch }, network) {
    dispatch('organizations/addNetwork', network, { root: true })
  },

  SOCKET_network_updated({ dispatch }, network) {
    dispatch('organizations/updateNetwork', network, { root: true })
  },

  SOCKET_network_removed({ dispatch }, { networkId }) {
    dispatch('organizations/removeNetwork', networkId, { root: true })
  },

  SOCKET_nodes({ dispatch }, { nodes }) {
    dispatch('organizations/setNodes', nodes, { root: true })
  },

  SOCKET_node_added({ dispatch }, node) {
    dispatch('organizations/addNode', node, { root: true })
  },

  SOCKET_node_updated({ dispatch }, node) {
    dispatch('organizations/updateNode', node, { root: true })
  },

  SOCKET_node_removed({ dispatch }, { nodeId }) {
    dispatch('organizations/removeNode', nodeId, { root: true })
  },

  SOCKET_operating_systems({ dispatch }, { operatingSystems }) {
    dispatch('organizations/setOperatingSystems', operatingSystems, { root: true })
  },

  SOCKET_operating_system_added({ dispatch }, operatingSystem) {
    dispatch('organizations/addOperatingSystem', operatingSystem, { root: true })
  },

  SOCKET_operating_system_updated({ dispatch }, operatingSystem) {
    dispatch('organizations/updateOperatingSystem', operatingSystem, { root: true })
  },

  SOCKET_operating_system_removed({ dispatch }, { operatingSystemId }) {
    dispatch('organizations/removeOperatingSystem', operatingSystemId, { root: true })
  },

  SOCKET_processed_data_types({ dispatch }, { processedDataTypes }) {
    dispatch('organizations/setProcessedDataTypes', processedDataTypes, { root: true })
  },

  SOCKET_processed_data_type_added({ dispatch }, processedDataType) {
    dispatch('organizations/addProcessedDataType', processedDataType, { root: true })
  },

  SOCKET_processed_data_type_updated({ dispatch }, processedDataType) {
    dispatch('organizations/updateProcessedDataType', processedDataType, { root: true })
  },

  SOCKET_processed_data_type_removed({ dispatch }, { processedDataTypeId }) {
    dispatch('organizations/removeProcessedDataType', processedDataTypeId, { root: true })
  },

  SOCKET_notify({ dispatch }, data) {
    dispatch('alerts/addAlert', data, { root: true })
  },

  notification_closed(context, data) {
    // heartbeat request
    const params = {
      event: 'notification_closed',
      data,
    }
    this.$socket.sendObj(params)
  },

  SOCKET_load_end({ dispatch }) {
    dispatch('ui/setDataLoaded', null, { root: true })
  },

  SOCKET_release_version({ dispatch }, { releaseVersion }) {
    dispatch('ui/setReleaseVersion', releaseVersion, { root: true })
  },
}
