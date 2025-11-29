
import api from "./authService";

export const getAllCategories = async () => {
  try {
    const response = await api.get("/categories/list");
    return response.data;
  } catch (error) {
    console.error("Lỗi tải danh mục:", error);
    throw error;
  }
};