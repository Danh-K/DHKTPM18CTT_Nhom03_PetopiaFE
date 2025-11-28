import api from "./authService";

const VOUCHER_API = "/admin/vouchers";

export const voucherService = {
  getAll: async (page = 0, size = 9) => {
    const res = await api.get(`${VOUCHER_API}/list`, {
      params: { page, size },
    });
    return res.data;
  },

  getByCode: async (code) => {
    const res = await api.get(`${VOUCHER_API}/${code}`);
    return res.data;
  },

  search: async (filters) => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append("keyword", filters.keyword);
    if (filters.status) params.append("status", filters.status);
    if (filters.type) params.append("type", filters.type);
    if (filters.page !== undefined) params.append("page", filters.page);
    if (filters.size !== undefined) params.append("size", filters.size);

    const res = await api.get(`${VOUCHER_API}/search?${params.toString()}`);
    return res.data;
  },

  inactive: async (voucherId) => {
    const res = await api.put(`${VOUCHER_API}/inactive/${voucherId}`);
    return res.data;
  },

  addVoucher: async (voucherData) => {
    const res = await api.post(`${VOUCHER_API}`, voucherData);
    return res.data;
  },

  updateVoucher: async (voucherData) => {
    const res = await api.post(`${VOUCHER_API}`, voucherData);
    return res.data;
  },
};