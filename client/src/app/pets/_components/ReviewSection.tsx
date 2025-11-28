"use client";

import { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import axiosInstance from "@/lib/utils/axios";
import { Star, User } from "lucide-react";
import { Review, PageResponse } from "@/types/Review";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface ReviewSectionProps {
  petId: string;
}

// SWR fetcher
const fetcher = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    
    // Xử lý trường hợp 204 No Content
    if (response.status === 204 || !response.data) {
      return {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0
      };
    }
    
    return response.data;
  } catch (error: unknown) {
    const err = error as { 
      response?: { status?: number }; 
    };
    
    // Nếu là 404 hoặc 204, trả về empty response thay vì throw error
    if (err.response?.status === 404 || err.response?.status === 204) {
      return {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0
      };
    }
    
    throw error;
  }
};

export default function ReviewSection({ petId }: ReviewSectionProps) {
  const [page, setPage] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'latest' | '1' | '2' | '3' | '4' | '5'>('all');
  const pageSize = 10;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch reviews từ API
  const { data, error, isLoading } = useSWR<PageResponse<Review>>(
    `/pets/${petId}/reviews?page=${page}&size=${pageSize}`,
    fetcher
  );

  const allReviews = data?.content || [];

  // Chuẩn hóa URL ảnh (hỗ trợ Google Drive, Cloudinary, và path tương đối)
  const getReviewImageSrc = (url?: string | null): string | null => {
    if (!url) return null;

    // Xử lý URL đầy đủ (Google Drive, Cloudinary, hoặc domain khác)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      // Cloudinary: https://res.cloudinary.com/...
      // Google Drive: https://drive.google.com/...
      // Hoặc bất kỳ URL https/http nào khác
      return url;
    }

    // Xử lý path tương đối từ backend (ví dụ: /uploads/reviews/abc.jpg)
    if (url.startsWith("/")) {
      return url;
    }

    // Path không có dấu / ở đầu, thêm vào
    return `/${url}`;
  };
  
  // Lọc reviews dựa trên filterType
  const filteredReviews = allReviews.filter((review) => {
    if (filterType === 'all') return true;
    if (filterType === 'latest') return true; // Sẽ sắp xếp sau
    return review.rating === parseInt(filterType);
  });

  // Sắp xếp theo mới nhất nếu chọn filter "latest"
  const reviews = filterType === 'latest' 
    ? [...filteredReviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : filteredReviews;

  const totalElements = data?.totalElements || 0;
  const totalPages = Math.ceil(totalElements / pageSize);

  // Reset về trang 0 khi thay đổi filter
  const handleFilterChange = (newFilter: typeof filterType) => {
    setFilterType(newFilter);
    setPage(0);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B6B]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <p className="text-center text-red-500">Không thể tải đánh giá</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Đánh giá của khách hàng
        {totalElements > 0 && (
          <span className="text-muted-foreground text-lg ml-2">
            ({totalElements} đánh giá)
          </span>
        )}
      </h2>

      {/* Bộ lọc đánh giá */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            filterType === 'all'
              ? 'bg-[#FF6B6B] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF6B6B] hover:text-[#FF6B6B]'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => handleFilterChange('latest')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            filterType === 'latest'
              ? 'bg-[#FF6B6B] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF6B6B] hover:text-[#FF6B6B]'
          }`}
        >
          Mới nhất
        </button>
        <button
          onClick={() => handleFilterChange('5')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
            filterType === '5'
              ? 'bg-[#FF6B6B] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF6B6B] hover:text-[#FF6B6B]'
          }`}
        >
          5 <Star size={16} className={filterType === '5' ? 'fill-white' : 'fill-yellow-400 text-yellow-400'} />
        </button>
        <button
          onClick={() => handleFilterChange('4')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
            filterType === '4'
              ? 'bg-[#FF6B6B] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF6B6B] hover:text-[#FF6B6B]'
          }`}
        >
          4 <Star size={16} className={filterType === '4' ? 'fill-white' : 'fill-yellow-400 text-yellow-400'} />
        </button>
        <button
          onClick={() => handleFilterChange('3')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
            filterType === '3'
              ? 'bg-[#FF6B6B] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF6B6B] hover:text-[#FF6B6B]'
          }`}
        >
          3 <Star size={16} className={filterType === '3' ? 'fill-white' : 'fill-yellow-400 text-yellow-400'} />
        </button>
        <button
          onClick={() => handleFilterChange('2')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
            filterType === '2'
              ? 'bg-[#FF6B6B] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF6B6B] hover:text-[#FF6B6B]'
          }`}
        >
          2 <Star size={16} className={filterType === '2' ? 'fill-white' : 'fill-yellow-400 text-yellow-400'} />
        </button>
        <button
          onClick={() => handleFilterChange('1')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
            filterType === '1'
              ? 'bg-[#FF6B6B] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF6B6B] hover:text-[#FF6B6B]'
          }`}
        >
          1 <Star size={16} className={filterType === '1' ? 'fill-white' : 'fill-yellow-400 text-yellow-400'} />
        </button>
      </div>

      {/* Hiển thị số lượng đánh giá sau khi lọc */}
      {filterType !== 'all' && reviews.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold text-[#FF6B6B]">{reviews.length}</span> đánh giá
          </p>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {allReviews.length === 0 
              ? "Chưa có đánh giá nào cho thú cưng này"
              : "Không có đánh giá nào phù hợp với bộ lọc"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.reviewId}
              className="border border-gray-200 rounded-lg p-6 bg-white"
            >
              {/* User info và rating */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {review.userAvatar ? (
                    <img
                      src={review.userAvatar}
                      alt={review.userFullName || "User"}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={24} className="text-gray-500" />
                    </div>
                  )}
                </div>

                {/* User name, rating, date */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">
                      {review.userFullName || "Người dùng ẩn danh"}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <p className="text-foreground leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {/* Review image nếu có */}
              {getReviewImageSrc(review.reviewImageUrl) && (
                <div 
                  className="mb-4 relative w-[200px] h-[200px] overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage(getReviewImageSrc(review.reviewImageUrl) as string)}
                >
                  <Image
                    src={getReviewImageSrc(review.reviewImageUrl) as string}
                    alt="Review image"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Reply từ shop nếu có */}
              {review.reply && (
                <div className="mt-4 ml-16 p-4 bg-gray-50 rounded-lg border-l-4 border-[#FF6B6B]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-[#FF6B6B]">
                      Phản hồi từ cửa hàng
                    </span>
                    {review.replyDate && (
                      <span className="text-sm text-muted-foreground">
                        • {formatDate(review.replyDate)}
                      </span>
                    )}
                  </div>
                  <p className="text-foreground">{review.reply}</p>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex gap-3 justify-center mt-8">
              <button
                className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i).map((num) => (
                <button
                  key={num}
                  className={`w-10 h-10 rounded-full ${
                    num === page
                      ? "bg-[#FF6B6B] text-white"
                      : "bg-white text-gray-600 hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
                  } border-2 ${
                    num === page ? "border-[#FF6B6B]" : "border-gray-300"
                  } flex items-center justify-center transition-all duration-300`}
                  onClick={() => setPage(num)}
                >
                  {num + 1}
                </button>
              ))}
              <button
                className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page === totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              >
                →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dialog để xem ảnh to */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0">
          {selectedImage && (
            <div className="relative w-full h-[80vh] flex items-center justify-center">
              <Image
                src={selectedImage}
                alt="Review image full size"
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

