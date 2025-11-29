import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'
import { IP } from '@/types/IP'

const axiosInstance = axios.create({
  baseURL: `${IP}`, 
  headers: {
    'Content-Type': 'application/json',
  },
})


axiosInstance.interceptors.request.use(
  (config) => {
    
    const token = useAuthStore.getState().accessToken

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      
      useAuthStore.getState().logout()
      
      
    }
    return Promise.reject(error)
  }
)

export default axiosInstance