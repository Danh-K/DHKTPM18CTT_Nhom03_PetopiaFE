import api from "./authService";

const DELIVERY_API = "/admin/deliveries"

export const deliveryService = {
  getAll: async (page = 0, size = 9) => {
    try {
      const res = await api.get(`${DELIVERY_API}`, { params: { page, size } })
      return res.data
    } catch (error) {
      console.error(" Error fetching deliveries:", error)
      throw error
    }
  },

  getById: async (deliveryId) => {
    try {
      const res = await api.get(`${DELIVERY_API}/${deliveryId}`)
      return res.data
    } catch (error) {
      console.error("[v0] Error fetching delivery:", error)
      throw error
    }
  },
}
