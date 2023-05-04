import transport from '@/api/utils/transport'
const apiAppName = 'ncircc'

export const createNcirccItem = ({
  organizationName,
  sphere,
  typeSubject,
  federalDistrict,
  address,
  okogu,
  okopf,
  inn,
  kpp,
  ocii,
  organizationId,
}) => {
  return transport.sendPost(`${apiAppName}/`, {
    organizationName,
    sphere,
    typeSubject,
    federalDistrict,
    address,
    okogu,
    okopf,
    inn,
    kpp,
    ocii,
    organizationId,
  })
}

export const updateNcirccItem = (id, params) => {
  return transport.sendPatch(`${apiAppName}/${id}/`, params)
}

export const deleteNcirccItem = (id, params) => {
  return transport.sendDelete(`${apiAppName}/${id}`, params)
}
