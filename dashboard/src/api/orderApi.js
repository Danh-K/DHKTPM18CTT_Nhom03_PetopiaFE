import axiosClient from "./axiosClient";

const orderApi = {
  // Lấy danh sách đơn hàng (có lọc)
  getAll: (params) => {
    // params: { status, keyword, startDate, endDate, page, size }
    return axiosClient.get("/admin/orders/all", { params });
  },

  // Lấy chi tiết đơn hàng
  getDetail: (id) => {
    return axiosClient.get(`/admin/orders/${id}`);
  },

  // Cập nhật trạng thái đơn hàng
  updateStatus: (id, status) => {
    return axiosClient.put(`/admin/orders/${id}/status`, null, {
      params: { status },
    });
  },

  // (Optional) Export báo cáo - Nếu backend chưa có thì FE tự xử lý từ data getAll
};

export default orderApi;
