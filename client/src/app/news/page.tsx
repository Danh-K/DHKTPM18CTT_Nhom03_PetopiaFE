"use client";

import { Loading } from "@/app/components/loading";
import { useArticles } from "@/hook/useArticles";
import { Article } from "@/types/Article";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Search, Filter, MessageCircle, User, Loader2 } from "lucide-react";

interface BlogCardProps {
  date: string;
  month: string;
  title: string;
  description: string;
  image: string;
  articleId: string;
  // Thêm prop comment mới nhất
  latestComment?: {
    user: string;
    content: string;
  };
}

export default function NewsPage() {
  const { data: articles, isLoading, error } = useArticles();

  // --- STATE QUẢN LÝ FILTER ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const newsList: Article[] = articles || [];

  // --- LOGIC LỌC VÀ SẮP XẾP (useMemo) ---
  const filteredArticles = useMemo(() => {
    let result = [...newsList];

    // 1. Tìm kiếm theo tiêu đề
    if (searchTerm.trim()) {
      result = result.filter((article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Sắp xếp theo ngày
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [newsList, searchTerm, sortOrder]);

  if (isLoading) return (<div className="h-screen flex flex-col justify-center items-center bg-[#FDF5F0]">
        <Loader2 className="animate-spin text-[#FF6B6B] w-12 h-12" />
        <p className="mt-4 text-[#5A3E2B] font-bold animate-pulse">Đang tìm tin tức thú vị...</p>
    </div>)

  if (error) {
    return (
      <div className="py-10 text-center text-red-500">
        Lỗi: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative py-24">
        <div className="absolute inset-0">
          <Image
            src="/assets/imgs/imgBackgroundTitle/bc-shop-listing.jpg"
            alt="News Background"
            width={1920}
            height={600}
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <h1 className="text-center text-6xl font-bold text-white drop-shadow-lg">
            Tin Tức & Sự Kiện
          </h1>
        </div>
      </div>

      <main className="min-h-screen bg-[#f5f5f5] p-8">
        <div className="mx-auto max-w-[1400px]">
          
          <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-[#f5e6d3]">
             <div className="relative w-full md:w-1/2 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff6b6b] transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#FFF5F5] border-2 border-transparent focus:border-[#ff6b6b] rounded-2xl outline-none text-[#2d2d2d] placeholder-gray-400 transition-all font-medium"
                />
             </div>

             <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-[#f5e6d3] px-4 py-3 rounded-2xl text-[#8B4513] font-bold">
                    <Filter size={18} />
                    <span className="whitespace-nowrap">Sắp xếp:</span>
                </div>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                  className="px-6 py-3 bg-white border-2 border-[#f5e6d3] hover:border-[#ff6b6b] focus:border-[#ff6b6b] rounded-2xl outline-none text-[#2d2d2d] font-bold cursor-pointer transition-all appearance-none"
                >
                  <option value="newest">Mới nhất ✨</option>
                  <option value="oldest">Cũ nhất 🕰️</option>
                </select>
             </div>
          </div>

          {filteredArticles.length === 0 ? (
             <div className="py-24 text-center text-gray-500">
                <div className="text-6xl mb-4">🤔</div>
                <p>Không tìm thấy bài viết nào phù hợp.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredArticles.map((article) => (
                <BlogCard
                  key={article.articleId}
                  articleId={article.articleId}
                  date={article.createdAt ? new Date(article.createdAt).getDate().toString() : "01"}
                  month={article.createdAt ? `Th${new Date(article.createdAt).getMonth() + 1}` : "Th1"}
                  title={article.title}
                  description={article.content}
                  image={article.imageUrl || "/assets/imgs/imgPet/animal-8165466_1280.jpg"}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function BlogCard({
  date,
  month,
  title,
  description,
  image,
  articleId
}: BlogCardProps) {
  return (
    <div className="group relative h-full">
      <Link href={`/news/${articleId}`}>
        <article className="relative flex min-h-[460px] h-full flex-col overflow-hidden rounded-[32px] bg-[#f5e6d3] p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          
          <div
            className="absolute inset-0 rounded-[32px] bg-[#f5e6d3]"
            style={{
              clipPath:
                'path("M 0 32 Q 0 0 32 0 L calc(100% - 32) 0 Q 100% 0 100% 32 L 100% calc(100% - 80) Q 100% calc(100% - 70) 95% calc(100% - 65) Q 90% calc(100% - 60) 85% calc(100% - 60) Q 80% calc(100% - 60) 75% calc(100% - 65) Q 70% calc(100% - 70) 70% calc(100% - 80) L 70% calc(100% - 32) Q 70% 100% 32 100% L 32 100% Q 0 100% 0 calc(100% - 32) Z")',
            }}
          />

          <div
            className="absolute inset-0 translate-x-full translate-y-full rounded-[32px] bg-[#ff7b7b] transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
            style={{
              clipPath:
                'path("M 0 32 Q 0 0 32 0 L calc(100% - 32) 0 Q 100% 0 100% 32 L 100% calc(100% - 80) Q 100% calc(100% - 70) 95% calc(100% - 65) Q 90% calc(100% - 60) 85% calc(100% - 60) Q 80% calc(100% - 60) 75% calc(100% - 65) Q 70% calc(100% - 70) 70% calc(100% - 80) L 70% calc(100% - 32) Q 70% 100% 32 100% L 32 100% Q 0 100% 0 calc(100% - 32) Z")',
              transformOrigin: "bottom right",
            }}
          />

          <div className="relative z-10 flex h-full flex-col">
            
            <div className="relative mb-4 overflow-hidden rounded-[24px]">
              <Image
                src={image || '/assets/imgs/imgService/service1.png' }
                alt={title}
                width={400}
                height={200}
                className="h-[200px] w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute left-4 top-4 flex flex-col items-center justify-center rounded-xl bg-[#ff6b6b] px-3 py-2 text-white shadow-lg transition-all duration-300 group-hover:bg-white group-hover:text-[#2d2d2d]">
                <span className="text-xl font-bold leading-none">{date}</span>
                <span className="text-sm font-medium leading-none">{month}</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col px-2 pb-2">
              <h3 className="mb-2 line-clamp-2 font-sans text-lg font-bold leading-tight text-[#2d2d2d] transition-colors duration-300 group-hover:text-white">
                {title}
              </h3>
              <p className="mb-4 line-clamp-3 font-sans text-sm leading-relaxed text-[#6b6b6b] transition-colors duration-300 group-hover:text-white/90">
                {description}
              </p>
{/* 
              {latestComment && (
                 <div className="mt-auto flex items-start gap-2 rounded-xl bg-white/60 p-3 backdrop-blur-sm transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white">
                    <div className="mt-0.5 min-w-[16px]">
                       <MessageCircle size={16} className="text-[#ff6b6b] group-hover:text-white" />
                    </div>
                    <div className="text-xs">
                        <span className="font-bold text-[#8B4513] group-hover:text-yellow-200 block mb-0.5">
                            {latestComment.user}
                        </span>
                        <p className="line-clamp-1 italic text-[#555] group-hover:text-white/90">
                            {latestComment.content}
                        </p>
                    </div>
                 </div>
              )} */}
            </div>
          </div>
        </article>
      </Link>

      <button
        className="absolute -bottom-2 -right-2 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#ff6b6b] text-white shadow-lg transition-all duration-300 hover:scale-110 group-hover:bg-[#1a3a52]"
        aria-label="Read more"
        onClick={() => (window.location.href = `/news/${articleId}`)}
      >
        <img
          src="/assets/svg/muiten.svg"
          alt="Arrow"
          className="h-6 w-6 -rotate-[65deg] transition-transform duration-300 filter brightness-0 invert group-hover:rotate-0"
        />
      </button>
    </div>
  );
}