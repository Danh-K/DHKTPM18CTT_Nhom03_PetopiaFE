import { Article } from "@/types/Article";
import axiosInstance from "@/lib/utils/axios";

export const ArticleService = {
  getAll: async (): Promise<Article[]> => {
    const response = await axiosInstance.get("/articles");
    return response.data.data; 
  },

  getById: async (id: string): Promise<Article> => {
    const response = await axiosInstance.get(`/articles/${id}`);
    return response.data.data; 
  },
  createComment: async (commentData: {
    articleId: string;
    userId: string;
    content: string;
  }): Promise<void> => {
    await axiosInstance.post("/article-comments", commentData);
  },
  
};
