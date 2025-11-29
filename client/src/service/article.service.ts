import { Article } from "@/types/Article";
import axiosInstance from "@/lib/utils/axios";

interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

export const ArticleService = {
  getAll: async (): Promise<Article[]> => {
    const response = await axiosInstance.get<ApiResponse<Article[]>>("/articles");
    const apiResponse = response.data;

    if (apiResponse.status !== 200 || !apiResponse.data) {
      throw new Error(apiResponse.message || "Không thể lấy danh sách bài viết");
    }

    return apiResponse.data;
  },
  getById: async (id: string): Promise<Article> => {
    const response = await axiosInstance.get<ApiResponse<Article>>(`/articles/${id}`);
    const apiResponse = response.data;

    if (apiResponse.status !== 200 || !apiResponse.data) {
      throw new Error(apiResponse.message || "Không tìm thấy bài viết");
    }

    return apiResponse.data;
  },
};