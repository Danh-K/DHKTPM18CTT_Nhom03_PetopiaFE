"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { trpc } from "../../../lib/utils/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArticleComment } from "@/types/Article";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hook/useToast";
import { useAuthStore } from "@/store/useAuthStore";

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = (params as { id: string })?.id as string | undefined;
  const utils = trpc.useContext();
  const { success, error: showError, ToastContainer } = useToast();
  const user = useAuthStore((state) => state.user);

  const { data: article, isLoading: loadingArticle, error } =
    trpc.article.getById.useQuery(
      { articleId: articleId ?? "" },
      { enabled: !!articleId }
    );

  const { data: comments, isLoading: loadingComments } =
    trpc.articleComment.getByArticle.useQuery(
      { articleId: articleId ?? "" },
      { enabled: !!articleId }
    );

  const createComment = trpc.articleComment.create.useMutation({
    onSuccess: async () => {
      await utils.articleComment.getByArticle.invalidate({
        articleId: articleId ?? "",
      });
      setContent("");
      success("Thành công", "Bình luận của bạn đã được thêm!");
    },
    onError: (error) => {
      showError("Lỗi", error.message || "Không thể thêm bình luận. Vui lòng thử lại.");
    },
  });

  const [content, setContent] = useState("");

  const getCommentDisplayName = (comment: ArticleComment) => {
    if (!comment) return "Khách";
    if (comment.userRole?.toUpperCase() === "ADMIN") return "Admin";
    if (comment.username) return comment.username;
    if (comment.userName) return comment.userName;
    return comment.userId ?? "Khách";
  };

  const petFeatures = [
    { image: "/assets/imgs/imgArticle/tintuc1.png", label: "Huấn luyện mèo" },
    { image: "/assets/imgs/imgArticle/tintuc2.png", label: "Đồ dùng thú cưng" },
    { image: "/assets/imgs/imgArticle/tintuc4.png", label: "Vận chuyển an toàn" },
    { image: "/assets/imgs/imgArticle/tintuc3.png", label: "Phối giống thú cưng" },
  ];

  const articleHighlights = [
    "Hướng dẫn chi tiết về cách chăm sóc thú cưng hàng ngày một cách khoa học",
    "Các lưu ý quan trọng về dinh dưỡng và sức khỏe cho từng loại thú cưng",
    "Mẹo hay để tạo môi trường sống thoải mái và an toàn cho pet",
    "Cách nhận biết các dấu hiệu bệnh tật sớm và xử lý kịp thời",
    "Lịch trình tiêm phòng và khám sức khỏe định kỳ cho thú cưng",
    "Tư vấn về việc lựa chọn thức ăn và chế độ dinh dưỡng phù hợp",
  ];

  if (loadingArticle)
    return <div className="py-20 text-center">Đang tải...</div>;
  if (error)
    return (
      <div className="py-10 text-center text-red-500">
        Lỗi: {error.message}
      </div>
    );
  if (!article) {
    return <div className="py-20 text-center">Không tìm thấy bài viết.</div>;
  }

  return (
    <main className="min-h-screen bg-white">
      {ToastContainer}
      {/* Back Button */}
      <div
        className="mx-auto py-6"
        style={{
          maxWidth: "calc(100vw - 264px)",
          paddingLeft: "132px",
          paddingRight: "132px",
        }}
      >
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Trở về tin tức
        </Link>
      </div>

      {/* Hero Section */}
      <div
        className="mx-auto"
        style={{
          maxWidth: "calc(100vw - 280px)",
          paddingLeft: "140px",
          paddingRight: "140px",
        }}
      >
        <div className="relative mb-8 overflow-hidden rounded-3xl">
          {/* 🔴 DÙNG img cho article.imageUrl (ảnh ngoài) */}
          <img
            src={article.imageUrl || "/assets/imgs/imgPet/animal-8165466_1280.jpg"}
            alt={article.title}
            className="h-[400px] w-full max-w-[1000px] object-cover"
            style={{ width: "100%" }}
          />

          {/* Date Badge */}
          <div className="absolute left-6 top-6 flex flex-col items-center justify-center rounded-xl bg-[#ff6b6b] px-4 py-3 text-white shadow-lg">
            <span className="text-2xl font-bold leading-none">
              {new Date(article.createdAt).getDate()}
            </span>
            <span className="text-sm font-medium leading-none">
              Th{new Date(article.createdAt).getMonth() + 1}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div
        className="mx-auto"
        style={{
          maxWidth: "calc(100vw - 264px)",
          paddingLeft: "132px",
          paddingRight: "132px",
        }}
      >
        {/* Title */}
        <h1 className="mb-6 font-sans text-4xl font-bold leading-tight text-[#2d2d2d] md:text-5xl">
          {article.title}
        </h1>

        {/* Short description */}
        <div className="mb-12 font-sans text-base leading-relaxed text-[#6b6b6b]">
          <div
            dangerouslySetInnerHTML={{
              __html: article.content.substring(0, 300) + "...",
            }}
          />
        </div>

        {/* Feature Icons */}
        <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          {petFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 rounded-2xl p-6 transition-transform hover:scale-105"
            >
              <div className="relative h-16 w-16">
                <Image
                  src={feature.image}
                  alt={feature.label}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-center font-sans text-sm font-medium text-[#2d2d2d]">
                {feature.label}
              </span>
            </div>
          ))}
        </div>

        {/* Two Column Content */}
        <div className="mb-16 grid gap-8 md:grid-cols-2">
          {/* Left Column - Image */}
          <div className="h-[400px] overflow-hidden rounded-2xl">
            {/* 🔴 DÙNG img cho article.imageUrl (ảnh ngoài) */}
            <img
              src={article.imageUrl || "/assets/imgs/imgPet/animal-8165466_1280.jpg"}
              alt="Nội dung bài viết"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right Column - Bullet Points */}
          <div className="flex h-[400px] flex-col justify-center space-y-4">
            {articleHighlights.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Image
                    src="/assets/svg/chanmeo.svg"
                    alt="Paw icon"
                    width={16}
                    height={16}
                    className="h-4 w-4 object-contain"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(38%) sepia(95%) saturate(7471%) hue-rotate(349deg) brightness(102%) contrast(101%)",
                    }}
                  />
                </div>
                <p className="font-sans text-sm leading-relaxed text-[#6b6b6b]">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Article Content */}
        <div className="prose mb-16 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Comments Section */}
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-[#2d2d2d]">
            Bình luận ({comments?.length ?? 0})
          </h2>

          <div className="mb-8 space-y-4">
            {loadingComments ? (
              <div className="py-8 text-center">
                <p className="text-gray-600">Đang tải bình luận...</p>
              </div>
            ) : (
              (comments ?? []).map((c: ArticleComment) => (
                <Card
                  key={c.commentId}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff6b6b] text-sm font-bold text-white">
                      {c.userId ? c.userId.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-semibold text-[#2d2d2d]">
                          {getCommentDisplayName(c)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(c.createdAt).toLocaleString("vi-VN")}
                        </span>
                      </div>
                      <div className="text-gray-700">{c.content}</div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Comment Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!content.trim()) return;
              
              // Kiểm tra nếu chưa đăng nhập
              if (!user?.userId) {
                showError("Yêu cầu đăng nhập", "Vui lòng đăng nhập để bình luận.");
                return;
              }
              
              createComment.mutate({
                articleId: articleId || "",
                content: content.trim(),
                userId: user.userId,
              });
            }}
            className="mb-10 rounded-lg border bg-gray-50 p-6"
          >
            <label className="mb-4 block text-lg font-medium text-[#2d2d2d]">
              Thêm bình luận
            </label>
            <Textarea
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setContent(e.target.value)
              }
              placeholder="Viết bình luận..."
              className="mb-4 h-24"
            />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setContent("")}>
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-[#ff6b6b] text-white hover:bg-[#ff5252]"
                disabled={createComment.isPending}
              >
                {createComment.isPending ? "Đang gửi..." : "Gửi bình luận"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
