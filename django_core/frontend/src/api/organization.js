import transport from '@/api/utils/transport'
import snakecaseKeys from 'snakecase-keys'
import { isNil } from 'lodash'
const apiAppName = 'organizations'

export const createOrganizationItem = ({ structureFile, ...rest }) => {
  if (!isNil(structureFile)) {
    const organizationData = new FormData()
    const snakeKeyedParams = snakecaseKeys(rest, { deep: true })

    for (const key in snakeKeyedParams) {
      if (snakeKeyedParams.hasOwnProperty(key)) {
        if (!isNil(snakeKeyedParams[key])) {
          organizationData.append(key, snakeKeyedParams[key])
        }
      }
    }

    organizationData.append('structure_file', structureFile)

    return transport.sendPostFormData(`${apiAppName}/`, organizationData)
  }

  return transport.sendPost(`${apiAppName}/`, rest)
}

export const updateOrganizationItem = (id, params) => {
  return transport.sendPatch(`${apiAppName}/${id}/`, params)
}

export const deleteOrganizationItem = (id, params) => {
  return transport.sendDelete(`${apiAppName}/${id}/`, params)
}

export const updateOrganizationItemSiems = (id, params) => {
  return transport.sendPut(`${apiAppName}/${id}/siems/`, params)
}
