import axios from 'axios'
import router from '@/router'
import { store } from '@/store'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'
import i18n from '@/translation'

let hostUrl = window.location.origin
const isProduction = process.env.NODE_ENV === 'production'
if (process.env.VUE_APP_SERVER_URL && !isProduction) {
  hostUrl = process.env.VUE_APP_SERVER_URL
}

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'

const axiosClient = axios.create({
  baseURL: hostUrl + '/api/v2',
  headers: {
    'Content-Type': 'application/json',
  },
})

const formDataAxiosClient = axios.create({
  baseURL: hostUrl + '/api/v2',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

axiosClient.defaults.transformResponse = [
  (data, headers) => {
    if (data && headers['content-type'].includes('application/json')) {
      return camelcaseKeys(JSON.parse(data), { deep: true })
    }
    return data
  },
]

axiosClient.defaults.transformRequest = [
  (data, headers) => {
    if (data && headers['Content-Type'].includes('application/json')) {
      return JSON.stringify(snakecaseKeys(data, { deep: true }))
    }
    return data
  },
]

axiosClient.interceptors.response.use((response) => {
  if (response.status === 401) {
    router.push({ name: 'login' })
    store.dispatch('operator/logoutUser')
  }
  return response
})

function setLanguage(config) {
  config.headers = {
    ...config.headers,
    'Accept-Language': i18n.locale,
  }
}

function setToken(config) {
  const token = store.state.operator.token
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Token ${token}`,
    }
  }
}

axiosClient.interceptors.request.use((config) => {
  setLanguage(config)
  setToken(config)
  return config
})

formDataAxiosClient.interceptors.response.use((response) => {
  if (response.status === 401) {
    router.push({ name: 'login' })
    store.dispatch('operator/logoutUser')
  }
  return response
})

formDataAxiosClient.interceptors.request.use((config) => {
  setLanguage(config)
  setToken(config)
  return config
})

export { axiosClient, formDataAxiosClient }
