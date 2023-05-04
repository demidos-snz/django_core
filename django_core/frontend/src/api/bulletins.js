import transport from '@/api/utils/transport'
import snakecaseKeys from 'snakecase-keys'

const apiAppName = 'bulletins'

export const loadBulletinItems = (params) => {
  return transport.sendGet(`${apiAppName}/`, params)
}

export const markBulletinRead = (id) => {
  return transport.sendPost(`${apiAppName}/${id}/read/`)
}

export const createBulletinItem = (data) => {
  const creationData = snakecaseKeys(data)
  const bulletinData = new FormData()

  for (const key in creationData) {
    if (creationData.hasOwnProperty(key)) {
      bulletinData.append(key, creationData[key])
    }
  }

  bulletinData.append('file', data.file)

  return transport.sendPostFormData(`${apiAppName}/`, bulletinData)
}

export const deleteBulletinItem = (id, params) => {
  return transport.sendDelete(`${apiAppName}/${id}/`, params)
}

export const downloadBulletin = (id) => {
  return transport.sendGet(`${apiAppName}/${id}/file/`)
}
