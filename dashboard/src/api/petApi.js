import axiosClient from "./axiosClient";

const petApi = {
  // --- THÊM HÀM NÀY ---
  // Gọi API GET /admin/pets (Giống Postman bạn test)
  getAll: () => {
    return axiosClient.get("/admin/pets");
  },

  // Search (Cũ - Tạm thời không dùng để load list ban đầu vì thiếu ảnh)
  search: (data) => {
    return axiosClient.post("/admin/pets/search", data);
  },

  // Lấy chi tiết
  getById: (id) => {
    return axiosClient.get(`/admin/pets/${id}`);
  },

  createOrUpdate: (formData) => {
    return axiosClient.post("/admin/pets", formData, {
      headers: {
        // Bắt buộc phải có header này để Backend nhận diện Multipart
        "Content-Type": "multipart/form-data",
      },
    });
  },
  // Các hàm khác giữ nguyên...
  inactive: (id) => {
    return axiosClient.put(`/admin/pets/${id}/inactive`);
  },
  delete: (id) => {
    return axiosClient.delete(`/admin/pets/${id}`);
  },
  getCategories: () => {
    return axiosClient.get("/categories/list");
  },
  getAllUsers: () => {
    return Promise.resolve({ data: [] });
  },
};

export default petApi;
