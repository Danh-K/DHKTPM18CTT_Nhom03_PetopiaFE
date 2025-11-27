import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import axiosInstance from "@/lib/utils/axios";

// Kiểu dữ liệu Article theo backend (ArticleResponseDTO)
export type Article = {
  articleId: string; // ví dụ: "AR001"
  title: string;
  content: string;
  authorId?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
};

// Kiểu ApiResponse chung theo backend
interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

export const articleRouter = router({
  // Lấy tất cả bài viết từ backend
  getAll: publicProcedure.query(async () => {
    const res = await axiosInstance.get<ApiResponse<Article[]>>("/articles");
    const apiRes = res.data;

    if (apiRes.status !== 200 || !apiRes.data) {
      throw new Error(apiRes.message || "Không thể lấy danh sách bài viết");
    }

    return apiRes.data;
  }),

  // (Tùy chọn) Tạo bài viết mới – dùng cho admin dashboard nếu cần
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        authorId: z.string().nullable().optional(),
        imageUrl: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const res = await axiosInstance.post<ApiResponse<Article>>("/articles", input);
      const apiRes = res.data;

      if (apiRes.status !== 200 || !apiRes.data) {
        throw new Error(apiRes.message || "Không thể tạo bài viết");
      }

      return apiRes.data;
    }),

  // Lấy chi tiết bài viết theo articleId (ARxxx) từ backend
  getById: publicProcedure
    .input(z.object({ articleId: z.string() }))
    .query(async ({ input }) => {
      const res = await axiosInstance.get<ApiResponse<Article>>(`/articles/${input.articleId}`);
      const apiRes = res.data;

      if (apiRes.status !== 200 || !apiRes.data) {
        throw new Error(apiRes.message || "Không tìm thấy bài viết");
      }

      return apiRes.data;
    }),
});