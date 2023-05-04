import { keyBy } from 'lodash'
import { ROLE } from '@/constants/enums'
import { store } from '@/store'

class PermissionHandler {
  constructor(roleModel) {
    this.roleModel = keyBy(roleModel, 'key')
  }

  getRuleKey(incident, user, entity) {
    const ruleKeys = [entity]

    const authorRole = incident.author.role
    if ([ROLE.CLIENT, ROLE.CLIENT_OF_FIRST_LINE].includes(authorRole)) {
      ruleKeys.push(2)
    } else {
      ruleKeys.push(1)
    }

    ruleKeys.push(incident.cmLine)
    ruleKeys.push(user.role)
    ruleKeys.push(incident.status)

    return PermissionHandler.__join(...ruleKeys)
  }

  canCreate(entity) {
    return this.can(entity, 'create')
  }

  canRead(entity) {
    return this.can(entity, 'read')
  }

  canUpdate(entity) {
    return this.can(entity, 'update')
  }

  canDelete(entity) {
    return this.can(entity, 'delete')
  }

  can(entity, rule) {
    const incident = store.getters['incidents/currentIncident']
    const user = store.getters['operator/operator']
    const ruleKey = this.getRuleKey(incident, user, entity)
    const rights = this.roleModel[ruleKey] || {}
    return rights[rule]
  }

  static __join() {
    return Array.from(arguments).join('__')
  }
}

export default PermissionHandler
