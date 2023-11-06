import axios from 'axios'
import api from '../constants/api'

const authAxiosInstance = axios.create({
  baseURL: api.apiPath,
  headers: {
    'Content-Type': 'application/json'
  }
})

authAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

authAxiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const { response } = error

    return response
  }
)

authAxiosInstance.defaults.withCredentials = true

export default authAxiosInstance
