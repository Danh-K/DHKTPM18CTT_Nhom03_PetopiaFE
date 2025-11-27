import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import axiosInstance from "@/lib/utils/axios";

/**
 * Simple mock router for ArticleComment (similar style to your article router).
 * - getAll: trả về danh sách bình luận mẫu
 * - getByArticle: trả về bình luận theo articleId
 * - create: tạo bình luận mới (mock, không lưu DB)
 *
 * Bạn có thể thay đổi để gọi DB (prisma/knex/...) trong production.
 */
export type ArticleComment = {
  commentId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  articleId: string;
  userId?: string | null;
  username?: string | null;
  userName?: string | null;
  userRole?: string | null;
};

// Kiểu ApiResponse chung theo backend
interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

export const articleCommentRouter = router({
  // Lấy tất cả bình luận (ít dùng ở FE, chủ yếu debug)
  getAll: publicProcedure.query(async () => {
    const res = await axiosInstance.get<ApiResponse<ArticleComment[]>>("/article-comments");
    const apiRes = res.data;

    if (apiRes.status !== 200 || !apiRes.data) {
      throw new Error(apiRes.message || "Không thể lấy danh sách bình luận");
    }

    return apiRes.data;
  }),

  // Lấy comment theo bài viết từ backend: GET /article-comments/article/{articleId}
  getByArticle: publicProcedure
    .input(
      z.object({
        articleId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const res = await axiosInstance.get<ApiResponse<ArticleComment[]>>(
        `/article-comments/article/${input.articleId}`
      );
      const apiRes = res.data;

      if (apiRes.status !== 200 || !apiRes.data) {
        throw new Error(apiRes.message || "Không thể lấy bình luận bài viết");
      }

      return apiRes.data;
    }),

  // Thêm comment mới: POST /article-comments
  create: publicProcedure
    .input(
      z.object({
        articleId: z.string(),
        content: z.string().min(1),
        userId: z.string().min(1, "UserId là bắt buộc"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Backend yêu cầu userId không được null, nên phải có userId
        if (!input.userId) {
          throw new Error("Vui lòng đăng nhập để bình luận");
        }
        
        const requestData = {
          articleId: input.articleId,
          content: input.content,
          userId: input.userId,
        };
        
        console.log("[articleComment.create] Gửi request với dữ liệu:", requestData);
        const res = await axiosInstance.post<ApiResponse<ArticleComment>>("/article-comments", requestData);
        const apiRes = res.data;

        console.log("[articleComment.create] Response từ backend:", apiRes);

        if (apiRes.status !== 200 || !apiRes.data) {
          throw new Error(apiRes.message || "Không thể thêm bình luận");
        }

        return apiRes.data;
      } catch (error: any) {
        console.error("[articleComment.create] Lỗi:", error);
        // Xử lý lỗi từ axios
        if (error.response) {
          // Backend trả về lỗi với status code
          const errorData = error.response.data;
          console.error("[articleComment.create] Error response data:", errorData);
          const errorMessage = errorData?.message || errorData?.error || `Lỗi từ server: ${error.response.status}`;
          throw new Error(errorMessage);
        } else if (error.request) {
          // Request đã được gửi nhưng không nhận được response
          console.error("[articleComment.create] Không nhận được response từ server");
          throw new Error("Không thể kết nối đến server. Vui lòng thử lại sau.");
        } else {
          // Lỗi khi setup request
          console.error("[articleComment.create] Lỗi khi setup request:", error.message);
          throw new Error(error.message || "Đã xảy ra lỗi khi thêm bình luận");
        }
      }
    }),
});

export default articleCommentRouter;