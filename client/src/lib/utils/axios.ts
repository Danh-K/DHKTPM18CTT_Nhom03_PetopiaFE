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
    const publicEndpoints = ['/auth/login', '/auth/register'];
    
    
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );

    
    if (!isPublicEndpoint) {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
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