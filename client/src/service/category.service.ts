import { Category } from "@/types/Category";
import axios from "axios";

export const CategoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await axios.get("/categories");
    return response.data;
  },
  getById: async (id: number): Promise<Category> => {
    const response = await axios.get(`/categories/${id}`);
    return response.data;
  },
};