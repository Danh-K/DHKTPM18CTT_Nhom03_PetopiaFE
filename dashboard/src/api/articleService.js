import api from "./authService";

const unwrapApiResponse = (res) => {
  const payload = res?.data;
  if (!payload || payload.status !== 200) {
    const message = payload?.message || "Có lỗi khi kết nối máy chủ.";
    throw new Error(message);
  }
  return payload.data;
};

export const articleService = {
  async getPagedArticles(params) {
    const res = await api.get("api/articles/paged", {
      params,
    });
    return unwrapApiResponse(res);
  },

  async getArticleById(articleId) {
    const res = await api.get(`api/articles/${articleId}`);
    return unwrapApiResponse(res);
  },

  async createArticle(payload) {
    const res = await api.post("api/articles", payload);
    return unwrapApiResponse(res);
  },

  async updateArticle(articleId, payload) {
    const res = await api.put(`api/articles/${articleId}`, payload);
    return unwrapApiResponse(res);
  },

  async deleteArticle(articleId, authorId) {
    const res = await api.delete(`api/articles/${articleId}`, {
      data: { authorId },
    });
    return unwrapApiResponse(res);
  },

  async getCommentsByArticle(articleId) {
    const res = await api.get(`api/article-comments/article/${articleId}`);
    return unwrapApiResponse(res);
  },

  async createComment(payload) {
    const res = await api.post("api/article-comments", payload);
    return unwrapApiResponse(res);
  },

  async deleteComment(commentId, userId) {
    const res = await api.delete(`api/article-comments/${commentId}`, {
      params: { userId },
    });
    return unwrapApiResponse(res);
  },
};

export default articleService;

