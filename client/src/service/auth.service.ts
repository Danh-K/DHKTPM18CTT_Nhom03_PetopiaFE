
import axiosInstance from '@/lib/utils/axios'
import { LoginRequest, RegisterRequest } from '@/lib/validations/auth'
import {  AuthState } from '@/types/User'


export const authService = {
  login: async (data: LoginRequest) => {
    const response = await axiosInstance.post<AuthState>('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterRequest) => {
    const response = await axiosInstance.post<AuthState>('/auth/register', data)
    return response.data
  }
}