import Organization from '@/store/models/organization'
import Segment from '@/store/models/segment'
import Sensor from '@/store/models/sensor'
import Siem from '@/store/models/siem'
import Ncircc from '@/store/models/organization_ncircc'
import Contact from '@/store/models/organization_ncircc_contact'
import Network from '@/store/models/network'
import Node from '@/store/models/node'
import OperatingSystem from '@/store/models/operating_system'
import ProcessedDataType from '@/store/models/processed_data_type'
import { keyBy, sortBy } from 'lodash'

export const getters = {
  organizations: (state) => {
    const mappedOrganizations = state.organizations.map((item) => new Organization(item))
    return keyBy(mappedOrganizations, 'id')
  },

  segments: (state) => {
    const storedSensors = state.sensors
    const segmentSensors = {}

    storedSensors.forEach((sensor) => {
      sensor.segments.forEach((segmentId) => {
        if (segmentSensors.hasOwnProperty(segmentId)) {
          segmentSensors[segmentId].push(sensor.id)
        } else {
          segmentSensors[segmentId] = [sensor.id]
        }
      })
    })

    return state.segments.map((item) => new Segment({ ...item, sensorIds: segmentSensors[item.id] || [] }))
  },

  sensors: (state) => {
    return state.sensors.map((item) => new Sensor(item))
  },

  siems: (state) => {
    const mappedSiems = state.siems.map((item) => new Siem(item))
    return keyBy(mappedSiems, 'id')
  },

  ncirccs: (state) => {
    const mappedNcirccs = state.ncirccs.map((item) => new Ncircc(item))
    return keyBy(mappedNcirccs, 'organizationId')
  },

  contacts: (state) => {
    const result = state.contacts.map((item) => new Contact(item))
    return sortBy(result, 'id')
  },

  networks: (state) => {
    const result = state.networks.map((item) => new Network(item))
    return sortBy(result, 'id')
  },

  nodes: (state) => {
    const result = state.nodes.map((item) => new Node(item))
    return sortBy(result, 'id')
  },

  operatingSystems: (state) => {
    const result = state.operatingSystems.map((item) => new OperatingSystem(item))
    return sortBy(result, 'id')
  },

  processedDataTypes: (state) => {
    const result = state.processedDataTypes.map((item) => new ProcessedDataType(item))
    return sortBy(result, 'id')
  },

  selectedOrganization: (state, getters) => {
    const id = state.selectedOrganizationId
    return id ? getters.organizations[id] : null
  },

  selectedOrganizationInActives: (state, getters) => {
    return state.selectedOrganizationIdInActives ? getters.organizations[state.selectedOrganizationIdInActives] : null
  },

  selectedOrganizationSegmentsInActives: (state, getters) => {
    return getters.selectedOrganizationInActives ? keyBy(getters.selectedOrganizationInActives.segments, 'id') : {}
  },

  selectedOrganizationNetworksInActives: (state, getters) => {
    const organization = getters.selectedOrganizationInActives

    if (!organization) return []

    const segmentIds = organization.segments.map((item) => item.id)
    const filteredNetworks = getters.networks.filter((item) => segmentIds.includes(item.segmentId))

    return filteredNetworks
  },

  selectedOrganizationNodesInActives: (state, getters) => {
    const organization = getters.selectedOrganizationInActives

    if (!organization) return []

    const networkIds = getters.selectedOrganizationNetworksInActives.map((item) => item.id)
    const filteredNodes = getters.nodes.filter((item) => networkIds.includes(item.networkId))

    return filteredNodes
  },

  selectedOrganizationSiems: (state, getters) => {
    const organization = getters.selectedOrganization
    return organization ? keyBy(organization.siems, 'id') : {}
  },

  selectedOrganizationSegments: (state, getters) => {
    const organization = getters.selectedOrganization
    return organization ? keyBy(organization.segments, 'id') : {}
  },

  selectedOrganizationSensors: (state, getters) => {
    const organization = getters.selectedOrganization
    const sensors = {}

    if (organization) {
      organization.segments.forEach((segment) => {
        segment.sensors.forEach((sensor) => {
          if (sensors.hasOwnProperty(sensor.id)) {
            sensors[sensor.id].push(sensor)
          } else {
            sensors[sensor.id] = sensor
          }
        })
      })
    }

    return sensors
  },

  selectedStructureSensor: (state, getters) => {
    const sensorId = state.selectedStructureSensorId
    if (!sensorId) return null

    const sensor = getters.selectedOrganizationSensors[sensorId]
    if (state.selectedStructureSegmentId) {
      sensor.currentSegment = getters.selectedOrganizationSegments[state.selectedStructureSegmentId]
    }
    return sensor
  },

  headOrganizationSegments: (state, getters) => {
    let segments = []
    const organization = getters.selectedOrganization
    if (organization) {
      const headOrg = getters.organizations[organization.headId]
      if (headOrg) {
        segments = headOrg.segments
      }
    }

    return sortBy(segments, 'id')
  },

  selectedStructureSiem: (state, getters) => {
    const siemId = state.selectedStructureSiemId
    if (!siemId) return null
    return getters.selectedOrganizationSiems[siemId]
  },

  selectedOrganizationNcircc: (state, getters) => {
    if (getters.selectedOrganization && getters.selectedOrganization.ncircc) {
      return getters.selectedOrganization.ncircc
    }
  },

  selectedOrganizationNcirccInActives: (state, getters) => {
    if (getters.selectedOrganizationInActives && getters.selectedOrganizationInActives.ncircc) {
      return getters.selectedOrganizationInActives.ncircc
    }
  },
}
