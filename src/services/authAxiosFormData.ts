import axios from 'axios'
import api from '../constants/api'

const authAxiosFormDataInstance = axios.create({
  baseURL: api.apiPath,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

authAxiosFormDataInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

authAxiosFormDataInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const { response } = error

    return response
  }
)

authAxiosFormDataInstance.defaults.withCredentials = true

export default authAxiosFormDataInstance
