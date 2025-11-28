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

  updateStatus: async (deliveryId, status) => {
    try {
      const res = await api.put(`${DELIVERY_API}/${deliveryId}/status`,null,{ params: { status } })
      return res.data
    } catch (error) {
      throw error.response?.data?.message || "Cập nhật thất bại"
    }
  },

  search: async (query = "", page = 0, size = 9) => {
    try {
      const res = await api.get(`${DELIVERY_API}/search`, {
      params: { query: query.trim() || undefined, page, size }
    });
    return res.data;
    } catch (error) {
      console.error("Error searching deliveries:", error);
      throw error;
    }
  },
}
