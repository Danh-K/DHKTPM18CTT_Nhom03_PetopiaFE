import api from "./authService";

const PROMOTION_API = "/admin/promotions";

export const promotionService = {
  getAll: async (page = 0, size = 9) => {
    const res = await api.get(`${PROMOTION_API}/list`, {
      params: { page, size },
    });
    return res.data;
  },
};