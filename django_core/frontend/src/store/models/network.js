import moment from 'moment'
import { store } from '@/store'
import { sortBy } from 'lodash'

class Network {
  constructor(obj) {
    this.id = obj.id
    this.createdRaw = obj.created
    this.modifiedRaw = obj.modified
    this.address = obj.address || ''
    this.internetAccess = obj.internetAccess
    this.name = obj.name || ''
    this.isOcii = obj.isOcii
    this.segmentId = obj.segment
  }

  get created() {
    const date = moment(this.createdRaw)
    return date.isValid() ? date : null
  }

  get modified() {
    const date = moment(this.modifiedRaw)
    return date.isValid() ? date : null
  }

  get nodes() {
    const storedNodes = store.getters['organizations/nodes']
    const nodes = storedNodes.reduce((results, node) => {
      if (node.networkId === this.id) results.push(node)
      return results
    }, [])

    return sortBy(nodes, 'id')
  }

  get segment() {
    const storedSegments = store.getters['organizations/segments']
    return storedSegments.find((segment) => segment.id === this.segmentId) || null
  }
}

export default Network
