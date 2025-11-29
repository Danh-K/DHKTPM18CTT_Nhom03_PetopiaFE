import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AuthState } from '@/types/User' 



export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => 
        set({ user, accessToken, isAuthenticated: true }),

      logout: () => 
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'petopia-auth-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
)