import transport from '@/api/utils/transport'

const apiAppName = 'recommendations'

export const createRecommendationSample = ({ organizationId, text }) => {
  return transport.sendPost(`${apiAppName}/samples/`, { text, organizationId })
}
