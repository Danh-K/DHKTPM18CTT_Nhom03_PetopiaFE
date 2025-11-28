import api from "./authService";

const PROMOTION_API = "/admin/promotions";

export const promotionService = {
  getAll: async (page = 0, size = 9) => {
    const res = await api.get(`${PROMOTION_API}/list`, {
      params: { page, size },
    });
    return res.data;
  },

  getByCode: async (code) => {
    const res = await api.get(`${PROMOTION_API}/${code}`);
    return res.data;
  },

  search: async (filters) => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append("keyword", filters.keyword);
    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    if (filters.status) params.append("status", filters.status);
    if (filters.type) params.append("type", filters.type);
    if (filters.page !== undefined) params.append("page", filters.page);
    if (filters.size !== undefined) params.append("size", filters.size);

    const res = await api.get(`${PROMOTION_API}/search?${params.toString()}`);
    return res.data;
  },

  inactive: async (promotionId) => {
    const res = await api.put(`${PROMOTION_API}/${promotionId}/inactive`);
    return res.data;
 },

 addPromotion: async (promotionData) => {
    const res = await api.post(`${PROMOTION_API}`, promotionData);
    return res.data;
  },

  updatePromotion: async (promotionData) => {
    const res = await api.post(`${PROMOTION_API}`, promotionData);
    return res.data;
  },
 
};