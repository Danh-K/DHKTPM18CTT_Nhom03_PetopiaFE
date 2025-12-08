import axiosClient from "./axiosClient";

const reviewApi = {
  getAll: (params) => {
    return axiosClient.get("/admin/reviews", { params });
  },

  getStats: () => {
    return axiosClient.get("/admin/reviews/stats");
  },

  getByPet: (petId) => {
    return axiosClient.get("/admin/reviews", { params: { petId, size: 100 } });
  },

  // Trả lời HOẶC Cập nhật câu trả lời (Dùng chung PUT)
  reply: (reviewId, content) => {
    return axiosClient.put(`/admin/reviews/${reviewId}/reply`, {
      replyContent: content,
    });
  },

  // Xóa câu trả lời của Admin (MỚI)
  deleteReply: (reviewId) => {
    return axiosClient.delete(`/admin/reviews/${reviewId}/reply`);
  },

  // Xóa toàn bộ đánh giá (Spam)
  deleteReview: (reviewId) => {
    return axiosClient.delete(`/admin/reviews/${reviewId}`);
  },
};

export default reviewApi;
