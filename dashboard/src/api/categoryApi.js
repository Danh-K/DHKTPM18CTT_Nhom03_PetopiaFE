import axiosClient from "./axiosClient";

const categoryApi = {
  getAll: (params) => {
    return axiosClient.get("/admin/categories", { params });
  },

  save: (formData) => {
    return axiosClient.post("/admin/categories/save", formData, {
      headers: {
        // QUAN TRỌNG: Để undefined để browser tự động thêm boundary
        "Content-Type": undefined,
      },
    });
  },

  delete: (id) => {
    return axiosClient.delete(`/admin/categories/${id}`);
  },

  getById: (id) => {
    return axiosClient.get(`/admin/categories/${id}`);
  },
};

export default categoryApi;
