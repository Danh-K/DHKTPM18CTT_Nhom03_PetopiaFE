"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hook/useToast";
import { useAuthStore } from "@/store/useAuthStore";
import { ArticleService } from "@/service/article.service";
import { useArticleById } from "@/hook/useArticles";
import { ArticleComment } from "@/types/Article";
import { Loading } from "@/app/components/loading";


export default function ArticleDetailPage() {
  const params = useParams();
  console.log(params?.id as string)
  const articleId = params?.id as string;

  const { success, error: showError, ToastContainer } = useToast();
  const user = useAuthStore((state) => state.user);

  
  const { data: article, isLoading, error } = useArticleById(articleId || "");


  const [content, setContent] = useState("");

  if (isLoading) return (<div className="h-screen flex flex-col justify-center items-center bg-[#FDF5F0]">
        <Loader2 className="animate-spin text-[#FF6B6B] w-12 h-12" />
        <p className="mt-4 text-[#5A3E2B] font-bold animate-pulse">Đang tìm thông tin của tin tức...</p>
    </div>)

  if (error || !article) {
    return (
      <div className="py-16 text-center text-red-500">
        Không tìm thấy bài viết.
      </div>
    );
  }

  const comments = article.comments ?? [];

  
  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    if (!content.trim()) return;

    if (!user?.userId) {
      showError("Yêu cầu đăng nhập", "Vui lòng đăng nhập để bình luận.");
      return;
    }

    try {
      await ArticleService.createComment({
        articleId,
        userId: user.userId,
        content: content.trim(),
      });

      success("Thành công", "Bình luận của bạn đã được thêm!");
      setContent("");
      window.location.reload(); 
    } catch (err: any) {
      showError("Lỗi", err.message || "Không thể gửi bình luận");
    }
  };

  return (
    <main className="min-h-screen bg-white">

      {<ToastContainer />}
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
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Trở về tin tức
        </Link>
      </div>

      
      <div className="mx-auto max-w-4xl">
        <div className="relative mb-8 overflow-hidden rounded-3xl">
          <Image
          src={article.imageUrl || "/assets/imgs/imgPet/animal-8165466_1280.jpg"}
          alt={article.title}
          width={1000}       
          height={400}       
          className="object-cover w-full"
        />


          <div className="absolute left-6 top-6 rounded-xl bg-red-500 px-4 py-3 text-white shadow-lg">
            <div className="text-2xl font-bold">
              {new Date(article.createdAt).getDate()}
            </div>
            <div className="text-sm">
              Th{new Date(article.createdAt).getMonth() + 1}
            </div>
          </div>
        </div>
      </div>

      
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-6 text-4xl font-bold">{article.title}</h1>

        <div className="prose max-w-none mb-16">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        
        <section>
          <h2 className="mb-6 text-2xl font-bold">
            Bình luận ({comments.length})
          </h2>

          <div className="mb-8 space-y-4">
            {comments.map((c: ArticleComment) => (
              <Card key={c.commentId} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
                    {c.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="flex gap-2 text-sm text-gray-700">
                      <span className="font-semibold">{c.username}</span>
                      <span className="text-gray-400">
                        {new Date(c.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-800">{c.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border bg-gray-50 p-6"
          >
            <label className="block mb-3 font-semibold">Thêm bình luận</label>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập bình luận..."
              className="h-24 mb-4"
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setContent("")}
              >
                Hủy
              </Button>

              <Button type="submit" className="bg-red-500 text-white">
                Gửi bình luận
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
