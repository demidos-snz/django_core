import transport from '@/api/utils/transport'

const apiAppName = 'actions_taken'

export const createActionTakenSample = ({ incidentId, text }) => {
  return transport.sendPost(`${apiAppName}/samples/`, { incidentId, text })
}
