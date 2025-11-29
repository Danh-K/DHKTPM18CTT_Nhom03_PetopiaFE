import api from "./authService"

const USER_API = "/admin/users"

export const userService = {
  getAll: async (page = 0, size = 10) => {
    const res = await api.get(`${USER_API}/list`, {
      params: { page, size },
    })
    return res.data
  },

  getUserById: async (userId) => {
    const res = await api.get(`${USER_API}/${userId}`)
    return res.data
  },

  updateUser: async (userId, userData) => {
    const res = await api.put(`${USER_API}/${userId}`, userData)
    return res.data
  },

  search: async (filters) => {
    const params = new URLSearchParams()
    if (filters.keyword) params.append("keyword", filters.keyword)
    if (filters.role) params.append("role", filters.role)
    if (filters.status) params.append("status", filters.status)
    if (filters.page !== undefined) params.append("page", filters.page)
    if (filters.size !== undefined) params.append("size", filters.size)
    const res = await api.get(`${USER_API}/search?${params.toString()}`)
    return res.data
  },
}
