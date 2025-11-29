"use client";

import { trpc } from "../../lib/utils/trpc";
import Link from "next/link";
import { Loading } from "../components/loading";

interface BlogCardProps {
  date: string;
  month: string;
  title: string;
  description: string;
  image: string;
  articleId: string;
}

export default function NewsPage() {
  const { data: articles, isLoading, error } = trpc.article.getAll.useQuery();

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="py-10 text-center text-red-500">
        Lỗi: {error.message}
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="relative py-24">
        <div className="absolute inset-0">
          <img
            src="/assets/imgs/imgBackgroundTitle/bc-shop-listing.jpg"
            alt="News Background"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <h1 className="text-center text-6xl font-bold text-white drop-shadow-lg">
            Tin Tức
          </h1>
        </div>
      </div>

      <main className="min-h-screen bg-[#f5f5f5] p-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {(articles || []).map((article) => (
              <BlogCard
                key={article.articleId}
                date={new Date(article.createdAt).getDate().toString()}
                month={`Th${new Date(article.createdAt).getMonth() + 1}`}
                title={article.title}
                description={article.content}
                image={article.imageUrl || "/assets/imgs/imgPet/animal-8165466_1280.jpg"}
                articleId={article.articleId || ""}
              />
            ))}
          </div>
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
  articleId,
}: BlogCardProps) {
  return (
    <div className="group relative">
      <Link href={`/news/${articleId}`}>
        <article className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[32px] bg-[#f5e6d3] p-4 transition-all duration-300 hover:shadow-xl">
          {/* Background layer */}
          <div
            className="absolute inset-0 rounded-[32px] bg-[#f5e6d3]"
            style={{
              clipPath:
                'path("M 0 32 Q 0 0 32 0 L calc(100% - 32) 0 Q 100% 0 100% 32 L 100% calc(100% - 80) Q 100% calc(100% - 70) 95% calc(100% - 65) Q 90% calc(100% - 60) 85% calc(100% - 60) Q 80% calc(100% - 60) 75% calc(100% - 65) Q 70% calc(100% - 70) 70% calc(100% - 80) L 70% calc(100% - 32) Q 70% 100% 32 100% L 32 100% Q 0 100% 0 calc(100% - 32) Z")',
            }}
          />

          {/* Hover layer */}
          <div
            className="absolute inset-0 translate-x-full translate-y-full rounded-[32px] bg-[#ff7b7b] transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
            style={{
              clipPath:
                'path("M 0 32 Q 0 0 32 0 L calc(100% - 32) 0 Q 100% 0 100% 32 L 100% calc(100% - 80) Q 100% calc(100% - 70) 95% calc(100% - 65) Q 90% calc(100% - 60) 85% calc(100% - 60) Q 80% calc(100% - 60) 75% calc(100% - 65) Q 70% calc(100% - 70) 70% calc(100% - 80) L 70% calc(100% - 32) Q 70% 100% 32 100% L 32 100% Q 0 100% 0 calc(100% - 32) Z")',
              transformOrigin: "bottom right",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col">
            {/* Image Container */}
            <div className="relative mb-4 overflow-hidden rounded-[24px]">
              {/* 🔴 DÙNG img cho image (ảnh ngoài) */}
              <img
                src={image || "/assets/imgs/imgPet/animal-8165466_1280.jpg"}
                alt={title}
                className="h-[180px] w-full object-cover"
              />

              {/* Date Badge */}
              <div className="absolute left-4 top-4 flex flex-col items-center justify-center rounded-xl bg-[#ff6b6b] px-3 py-2 text-white shadow-lg transition-all duration-300 group-hover:bg-white group-hover:text-[#2d2d2d]">
                <span className="text-xl font-bold leading-none">{date}</span>
                <span className="text-sm font-medium leading-none">{month}</span>
              </div>
            </div>

            {/* Text content */}
            <div className="flex flex-1 flex-col px-2 pb-2">
              <h3 className="mb-2 line-clamp-2 font-sans text-lg font-bold leading-tight text-[#2d2d2d] transition-colors duration-300 group-hover:text-white">
                {title}
              </h3>
              <p className="mb-3 flex-1 line-clamp-3 font-sans text-sm leading-relaxed text-[#6b6b6b] transition-colors duration-300 group-hover:text-white">
                {description}
              </p>
            </div>
          </div>
        </article>
      </Link>

      {/* Nút đọc thêm */}
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
