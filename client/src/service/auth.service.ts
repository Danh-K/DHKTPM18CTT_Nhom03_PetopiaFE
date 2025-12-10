import axiosInstance from '@/lib/utils/axios'
import { LoginRequest, RegisterRequest } from '@/lib/validations/auth'
import { AuthState } from '@/types/User'

export const authService = {
  
  login: async (data: LoginRequest) => {
    const response = await axiosInstance.post<AuthState>('/auth/login', data)
    return response.data
  },

  
  register: async (data: RegisterRequest) => {
    const response = await axiosInstance.post<AuthState>('/auth/register', data)
    return response.data
  },

  
  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email })
    return response.data
  },

  
  verifyOtp: async (email: string, otp: string) => {
    const response = await axiosInstance.post('/auth/verify-otp', { email, otp })
    return response.data
  },

  
  resetPassword: async (email: string, newPassword: string) => {
    const response = await axiosInstance.post('/auth/reset-password', {
      email,
      newPassword,
    })
    return response.data
  },
}
