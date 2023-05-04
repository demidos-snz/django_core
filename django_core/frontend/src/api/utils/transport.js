import { axiosClient, formDataAxiosClient } from '@/api/utils/axios'
import to from '@/api/utils/to'

class Transport {
  async sendGet(url, params = {}, handleStatus = true, responseType = 'json') {
    return to(axiosClient.get(url, { params, responseType }), handleStatus)
  }

  async sendPost(url, params = {}, handleStatus = true) {
    return to(axiosClient.post(url, params), handleStatus)
  }

  async sendPostFormData(url, params = {}) {
    return to(formDataAxiosClient.post(url, params))
  }

  async sendPut(url, params = {}) {
    return to(axiosClient.put(url, params))
  }

  async sendPatch(url, params = {}) {
    return to(axiosClient.patch(url, params))
  }

  async sendDelete(url, params = {}) {
    return to(axiosClient.delete(url, { params }))
  }
}

const transport = new Transport()
export default transport
