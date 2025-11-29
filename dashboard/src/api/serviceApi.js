// src/api/serviceApi.js
import axiosClient from "./axiosClient"; // Đảm bảo bạn đã config axios

const serviceApi = {
  // Lấy danh sách (có phân trang & tìm kiếm)
  getAll: (params) => {
    const url = "/admin/services";
    return axiosClient.get(url, { params });
  },

  // Tạo mới (Multipart: JSON + Image)
  create: (data, imageFile) => {
    const url = "/admin/services";
    const formData = new FormData();

    // Backend yêu cầu @RequestPart("service") là String JSON
    formData.append("service", JSON.stringify(data));

    // Backend yêu cầu @RequestPart("image") là File
    if (imageFile) {
      formData.append("image", imageFile);
    }

    return axiosClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Cập nhật (Multipart: JSON + Image)
  update: (id, data, imageFile) => {
    const url = `/admin/services/${id}`;
    const formData = new FormData();

    formData.append("service", JSON.stringify(data));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    return axiosClient.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Xóa
  delete: (id) => {
    const url = `/admin/services/${id}`;
    return axiosClient.delete(url);
  },
};

export default serviceApi;
