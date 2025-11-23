import { Article } from "@/types/Article";
import axios from "axios";

export const ArticleService = {
  getAll: async (): Promise<Article[]> => {
    const response = await axios.get("/articles");
    return response.data;
  },
  getById: async (id: number): Promise<Article> => {
    const response = await axios.get(`/articles/${id}`);
    return response.data;
  },
};