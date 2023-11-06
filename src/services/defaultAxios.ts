import axios from 'axios'
import api from '../constants/api'

const defaultAxiosInstance = axios.create({
  baseURL: api.apiPath,
  headers: {
    'Content-Type': 'application/json'
  }
})

defaultAxiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return error.response
  }
)

defaultAxiosInstance.defaults.withCredentials = true

export default defaultAxiosInstance
