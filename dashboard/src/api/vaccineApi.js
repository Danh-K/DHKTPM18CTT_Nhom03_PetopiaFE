import axiosClient from "./axiosClient";

const vaccineApi = {
  getAll: (page = 0, size = 1000) => {
    return axiosClient.get(`/admin/vaccines?page=${page}&size=${size}`);
  },

  getStats: () => {
    return axiosClient.get("/admin/vaccines/stats");
  },

  // --- API MỚI: Lấy lịch sử theo Pet ID ---
  getHistoryByPet: (petId) => {
    return axiosClient.get(`/admin/vaccines/pet/${petId}`);
  },

  createBatch: (data) => {
    return axiosClient.post("/admin/vaccines", data);
  },

  update: (id, data) => {
    return axiosClient.put(`/admin/vaccines/${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/admin/vaccines/${id}`);
  },
};

export default vaccineApi;
