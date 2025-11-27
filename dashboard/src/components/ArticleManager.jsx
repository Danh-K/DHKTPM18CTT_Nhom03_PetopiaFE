import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import articleService from "../api/articleService";

export default function ArticleManager() {
  const { user } = useSelector((state) => state.auth);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({
    articleId: "",
    title: "",
    content: "",
    imageUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const loadArticles = async (nextPage = 0, kw = keyword) => {
    setListLoading(true);
    try {
      const data = await articleService.getPagedArticles({
        page: nextPage,
        size,
        sortBy: "createdAt",
        sortDir: "desc",
        keyword: kw?.trim() ? kw : undefined,
      });

      setArticles(data?.articles || []);
      setTotalPages(data?.totalPages || 1);
      setPage(data?.currentPage ?? nextPage);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Không thể tải danh sách bài viết");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadArticles(0);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadArticles(0, keyword);
    }, 400);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const fetchArticles = (targetPage) => {
    loadArticles(targetPage);
  };

  const fetchComments = async (articleId) => {
    const commentList = await articleService.getCommentsByArticle(articleId);
    setComments(commentList || []);
  };

  const fetchArticleDetail = async (id) => {
    try {
      setLoading(true);
      const articleDetail = await articleService.getArticleById(id);
      setSelectedArticle(articleDetail || null);
      await fetchComments(id);
      setShowDetail(true);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Không thể tải chi tiết bài viết");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (article = null) => {
    if (article?.articleId) {
      setForm({
        articleId: article.articleId,
        title: article.title || "",
        content: article.content || "",
        imageUrl: article.imageUrl || "",
      });
    } else {
      setForm({ articleId: "", title: "", content: "", imageUrl: "" });
    }
    setShowModal(true);
  };

  const buildPayload = () => {
    if (!user?.userId) {
      throw new Error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
    }

    return {
      title: form.title.trim(),
      content: form.content.trim(),
      imageUrl: form.imageUrl.trim() || null,
      authorId: user.userId,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Tiêu đề không được để trống!");

    setSubmitting(true);
    try {
      const payload = buildPayload();

      if (form.articleId) {
        await articleService.updateArticle(form.articleId, payload);
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await articleService.createArticle(payload);
        toast.success("Thêm bài viết thành công!");
      }

      setShowModal(false);
      loadArticles(form.articleId ? page : 0);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Không thể lưu bài viết!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa bài viết này?")) return;

    if (!user?.userId) {
      toast.error("Không xác định được người thực hiện xóa.");
      return;
    }

    try {
      await articleService.deleteArticle(id, user.userId);
      toast.success("Đã xóa bài viết!");
      loadArticles(page);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Không thể xóa bài viết!");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!selectedArticle?.articleId) return;
    if (!commentContent.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }
    if (!user?.userId) {
      toast.error("Không xác định được tài khoản admin");
      return;
    }

    setCommentSubmitting(true);
    try {
      await articleService.createComment({
        articleId: selectedArticle.articleId,
        content: commentContent.trim(),
        userId: user.userId,
      });
      toast.success("Đã thêm bình luận");
      setCommentContent("");
      await fetchComments(selectedArticle.articleId);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Không thể gửi bình luận");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (comment) => {
    if (!selectedArticle?.articleId) return;

    const requestUserId = comment?.userId || user?.userId;
    if (!requestUserId) {
      toast.error("Không xác định được người thực hiện yêu cầu xóa.");
      return;
    }

    if (!window.confirm("Xóa bình luận này?")) return;
    try {
      setDeletingCommentId(comment.commentId);
      await articleService.deleteComment(comment.commentId, requestUserId);
      toast.success("Đã xóa bình luận");
      await fetchComments(selectedArticle.articleId);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Không thể xóa bình luận");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const getCommentDisplayName = (c) => {
    if (!c) return "Ẩn danh";
    if (c.userRole === "ADMIN") return "Admin";
    if (c.userName) return c.userName;
    if (c.username) return c.username;
    if (c.fullName) return c.fullName;
    if (c.userId === user?.userId) {
      return user?.fullName || user?.username || "Admin";
    }
    if (c.userId) return c.userId;
    return "Ẩn danh";
  };

  return (
    <div className="flex flex-col gap-6 bg-gray-50 min-h-screen p-6 font-sans">
      <Toaster position="top-right" />

      <div className="bg-white shadow-md rounded-xl px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Quản Lý Bài Viết</h1>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-emerald-500 to-cyan-400 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform"
          >
            + Thêm Bài Viết
          </button>
        </div>
      </div>

      {!showDetail && (
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Mã bài viết</th>
                <th className="px-4 py-3 text-left">Tiêu đề</th>
                <th className="px-4 py-3 text-left">Ảnh minh họa</th>
                <th className="px-4 py-3 text-left">Ngày tạo</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {listLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-indigo-600 font-semibold">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : (
                <>
                  {articles.map((a) => (
                    <tr key={a.articleId} className="border-b hover:bg-indigo-50 transition duration-150">
                      <td className="px-4 py-3">{a.articleId}</td>
                      <td
                        className="px-4 py-3 font-medium cursor-pointer hover:text-indigo-600"
                        onClick={() => fetchArticleDetail(a.articleId)}
                        title="Xem chi tiết"
                      >
                        {a.title}
                      </td>
                      <td className="px-4 py-3">
                        {a.imageUrl ? (
                          <img src={a.imageUrl} alt={a.title} className="w-16 h-16 object-cover rounded-lg border" />
                        ) : (
                          <span className="text-gray-400 italic">Không có ảnh</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{a.createdAt?.split("T")[0] || "—"}</td>
                      <td className="px-4 py-3 text-center space-x-2">
                        <button onClick={() => openModal(a)} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                          Sửa
                        </button>
                        <button onClick={() => handleDelete(a.articleId)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                  {articles.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-gray-500 py-6">
                        Không có bài viết.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>

          <div className="flex justify-center items-center py-4 gap-2">
            <button onClick={() => fetchArticles(page - 1)} disabled={page === 0} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
              ← Trước
            </button>
            <span>
              Trang {page + 1}/{totalPages}
            </span>
            <button onClick={() => fetchArticles(page + 1)} disabled={page + 1 >= totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
              Sau →
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl animate-slideIn">
            <h2 className="text-2xl font-bold text-indigo-600 mb-5">{form.articleId ? "Sửa Bài Viết" : "Thêm Bài Viết"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Tiêu đề *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Nội dung</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows="4"
                  className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-indigo-500"
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-1">Link ảnh minh họa</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
                  Hủy
                </button>
                <button type="submit" disabled={submitting} className="bg-gradient-to-r from-emerald-500 to-cyan-400 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:scale-105 disabled:opacity-60">
                  {submitting ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && selectedArticle && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowDetail(false)} className="text-indigo-600 font-semibold hover:underline mb-4">
              ← Quay lại
            </button>

            {loading ? (
              <p className="text-gray-500">Đang tải chi tiết...</p>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-indigo-600 mb-2">{selectedArticle.title}</h2>
                <p className="text-gray-500 text-sm mb-4">Ngày tạo: {selectedArticle.createdAt?.split("T")[0]}</p>
                {selectedArticle.imageUrl && (
                  <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="rounded-lg w-full max-h-96 object-cover mb-4" />
                )}
                <p className="text-gray-700 mb-4 whitespace-pre-line">{selectedArticle.content}</p>

                <h3 className="text-lg font-semibold text-indigo-600 mb-2">💬 Bình luận:</h3>
                <ul className="space-y-2">
                  {comments.length > 0 ? (
                    comments.map((c) => (
                      <li key={c.commentId} className="border p-3 rounded-lg">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <b>{getCommentDisplayName(c)}:</b> <span>{c.content}</span>
                            <p className="text-xs text-gray-500 mt-1">
                              {c.createdAt ? new Date(c.createdAt).toLocaleString("vi-VN") : ""}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteComment(c)}
                            className="text-sm text-red-500 hover:text-red-600"
                            disabled={deletingCommentId === c.commentId}
                          >
                            {deletingCommentId === c.commentId ? "Đang xóa..." : "Xóa"}
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Chưa có bình luận nào.</p>
                  )}
                </ul>

                <form onSubmit={handleAddComment} className="mt-6 space-y-2">
                  <label className="font-semibold text-sm text-gray-700">Phản hồi với tư cách Admin</label>
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    rows="3"
                    placeholder="Nhập nội dung bình luận..."
                    className="w-full border rounded-lg p-3 focus:border-indigo-500"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={commentSubmitting}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 disabled:opacity-60"
                    >
                      {commentSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
          @keyframes slideIn { 
            from { transform: translateY(-40px); opacity: 0; } 
            to { transform: translateY(0); opacity: 1; } 
          }
          .animate-slideIn { animation: slideIn 0.3s ease; }
        `}</style>
    </div>
  );
}


