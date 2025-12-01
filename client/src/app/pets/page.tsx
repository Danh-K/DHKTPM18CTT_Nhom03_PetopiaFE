"use client";
import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import axiosInstance from "@/lib/utils/axios";
import Image from "next/image";
import { Loading } from "../components/loading";
import { useCart } from "@/store/useCartStore";
import { Search, ChevronDown } from "lucide-react";
import CategoryFilter from "@/app/pets/_components/CategoryFilter";
import PriceRangeFilter from "@/app/pets/_components/PriceRangeFilter";
import ProductCard from "@/app/pets/_components/ProductCard";
import MiniCart from "@/app/carts/_components/MiniCart";

import type { Pet } from "@/types/Pet";
import type { Category } from "@/types/Category";

interface PetResponse {
  content: Pet[];
  totalElements: number;
  page: number;
  size: number;
}

interface PetSearchRequest {
  name?: string;
  categoryId?: string;
  minAge?: number;
  maxAge?: number;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  minFinalPrice?: number;  // Giá sau giảm (min)
  maxFinalPrice?: number;  // Giá sau giảm (max)
  healthStatus?: string;
  minWeight?: number;
  maxWeight?: number;
  minHeight?: number;
  maxHeight?: number;
  minRating?: number;
  onSale?: boolean;
  color?: string;
  furType?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

// SWR fetcher cho GET request (dùng axiosInstance)
const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

// Axios fetcher cho POST search request (dùng axiosInstance)
const axiosSearchFetcher = async ([url, body]: [string, PetSearchRequest]) => {
  try {
    console.log('🚀 Calling Search API:', { url, body });
    const response = await axiosInstance.post(url, body);
    console.log('✅ Search API Response:', response.data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown; status?: number }; message?: string };
    console.error('❌ Search API Error:', err.response?.data || err.message);
    // Nếu là 404 (không tìm thấy), trả về empty response thay vì throw error
    if (err.response?.status === 404) {
      return {
        content: [],
        totalElements: 0,
        page: body.page || 0,
        size: body.pageSize || 6,
      };
    }
    throw error;
  }
};

export default function PetsPage() {
  const pageSize = 6;
  const [page, setPage] = useState(0);
  const { addItem, openMiniCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Query thực tế để fetch API
  const [searchInput, setSearchInput] = useState(""); // Input từ user
  const [sortBy, setSortBy] = useState("default");

  // Fetch categories từ API (dùng axiosInstance với relative path)
  const { data: categoriesData } = useSWR<Category[]>(
    '/pets/categories',
    fetcher
  );

  // Tính count cho mỗi category và lấy giá cao nhất dựa trên tất cả pets (không phân trang)
  const { data: allPetsData } = useSWR<PetResponse>(
    '/pets?page=0&size=1000',
    fetcher
  );

  // Tính max price từ tất cả pets
  const maxPrice = useMemo(() => {
    if (!allPetsData?.content || allPetsData.content.length === 0) {
      return 10000000;
    }
    const prices = allPetsData.content.map(pet => pet.price);
    return Math.max(...prices);
  }, [allPetsData]);

  // Always start from 0 and go to maxPrice
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [isPriceRangeInitialized, setIsPriceRangeInitialized] = useState(false);

  // Update priceRange when maxPrice changes (only once on initial load)
  useEffect(() => {
    if (!isPriceRangeInitialized && maxPrice !== 10000000) {
      setPriceRange([0, maxPrice]);
      setIsPriceRangeInitialized(true);
    }
  }, [maxPrice, isPriceRangeInitialized]);

  // Build search request body
  const searchRequest: PetSearchRequest = useMemo(() => {
    const request: PetSearchRequest = {
      page,
      pageSize,
    };

    if (searchQuery.trim()) {
      request.name = searchQuery.trim();
    }

    if (selectedCategory) {
      // Tìm categoryId từ categoryName
      const category = categoriesData?.find(cat => cat.name === selectedCategory);
      if (category) {
        request.categoryId = category.categoryId;
      }
    }

    // Gửi minFinalPrice và maxFinalPrice để lọc theo giá sau giảm
    if (priceRange[0] > 0) {
      request.minFinalPrice = priceRange[0];
    }
    
    if (priceRange[1] < maxPrice && maxPrice !== 10000000) {
      request.maxFinalPrice = priceRange[1];
    }

    // Sort mapping - Rating sẽ được sort ở client side
    switch (sortBy) {
      case "price-low":
        request.sortBy = "finalPrice";
        request.sortDirection = "asc";
        break;
      case "price-high":
        request.sortBy = "finalPrice";
        request.sortDirection = "desc";
        break;
      case "rating":
        // Không gửi sortBy cho rating vì field này không có trong DB
        // Sẽ sort ở client side sau khi nhận data
        request.sortBy = "createdAt";
        request.sortDirection = "desc";
        break;
      case "latest":
        request.sortBy = "createdAt";
        request.sortDirection = "desc";
        break;
      default:
        // Mặc định sort theo createdAt desc
        request.sortBy = "createdAt";
        request.sortDirection = "desc";
        break;
    }

    return request;
  }, [page, pageSize, searchQuery, selectedCategory, priceRange, sortBy, categoriesData, maxPrice]);

  // Check if we need to use search API (có filter hoặc search)
  const shouldUseSearch = useMemo(() => {
    // Có search query
    if (searchQuery.trim()) return true;
    
    // Có category được chọn
    if (selectedCategory) return true;
    
    // Có sort được áp dụng
    if (sortBy !== "default") return true;
    
    // Kiểm tra price range có khác với giá trị mặc định không
    // Chỉ kiểm tra khi đã khởi tạo xong
    if (isPriceRangeInitialized) {
      if (priceRange[0] > 0 || priceRange[1] < maxPrice) {
        return true;
      }
    }
    
    return false;
  }, [searchQuery, selectedCategory, sortBy, priceRange, maxPrice, isPriceRangeInitialized]);

  // Fetch data với search API (POST) hoặc get all API (GET với SWR fetch)
  const { data, error, isLoading } = useSWR<PetResponse>(
    shouldUseSearch 
      ? ['/pets/search', searchRequest]
      : `/pets?page=${page}&size=${pageSize}`,
    shouldUseSearch
      ? axiosSearchFetcher
      : fetcher
  );

  // Debug log
  useEffect(() => {
    console.log('🔍 Search State:', {
      shouldUseSearch,
      selectedCategory,
      searchRequest,
      maxPrice,
      priceRange,
      isPriceRangeInitialized,
      categoriesData
    });
  }, [shouldUseSearch, selectedCategory, searchRequest, maxPrice, priceRange, isPriceRangeInitialized, categoriesData]);

  // Sort pets theo rating ở client side nếu cần
  const pets = useMemo(() => {
    const petsData = data?.content || [];
    
    // Nếu sort by rating, sort ở client side
    if (sortBy === "rating") {
      return [...petsData].sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return ratingB - ratingA; // Sort descending (cao đến thấp)
      });
    }
    
    return petsData;
  }, [data?.content, sortBy]);
  
  const totalElements = data?.totalElements || 0;

  // Xử lý categoriesData - có thể là array trực tiếp hoặc object wrapper
  const categoriesArray: Category[] = Array.isArray(categoriesData) 
    ? categoriesData 
    : (categoriesData && typeof categoriesData === 'object' && 'data' in categoriesData) 
      ? (categoriesData as { data: Category[] }).data 
      : [];

  const categories = categoriesArray.map((cat: Category) => {
    const count = (allPetsData?.content || []).filter(pet => pet.categoryName === cat.name).length;
    return {
      ...cat,
      count
    };
  });

  // Reset page về 0 khi filter thay đổi
  useEffect(() => {
    setPage(0);
  }, [selectedCategory, searchQuery, sortBy, priceRange]);

  // Handle search button click hoặc Enter
  const handleSearch = () => {
    setSearchQuery(searchInput); // Cập nhật query từ input
    setPage(0); // Reset về trang đầu
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-10 text-red-500">Lỗi: {error.message}</div>;

  // Lấy thumbnail cho từng pet
  const getThumbnail = (petId: string, mainImageUrl: string | null) => {
    if (mainImageUrl) {
      // Chỉ dùng URL đầy đủ
      if (mainImageUrl.startsWith('http://') || mainImageUrl.startsWith('https://')) {
        return mainImageUrl;
      }
    }
    // Fallback về ảnh local
    return "/assets/imgs/imgPet/cat-6593947_1280.jpg";
  };

  const totalPages = Math.ceil(totalElements / pageSize);

  return (
    <>
      {/* Background section with full width */}
      <div className="relative py-24 w-full">
        <div className="absolute inset-0">
          <Image 
            src="/assets/imgs/imgBackgroundTitle/bc-shop-details.jpg"
            alt="Pets Background"
            fill
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 
            className="text-center font-bold text-6xl text-white drop-shadow-lg"
          >
            Thú cưng
          </h1>
        </div>
      </div>
      
      {/* Main Content Section */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    className="w-full rounded-full border border-gray-300 bg-white px-6 py-3 text-[#2d2d2d] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent"
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="rounded-full bg-[#FF6B6B] p-3 text-white hover:bg-[#FF5555] transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h2 className="mb-4 rounded-2xl bg-[#F5E6D3] px-6 py-3 text-lg font-bold text-[#2d2d2d]">
                Mua theo danh mục
              </h2>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h2 className="mb-4 rounded-2xl bg-[#F5E6D3] px-6 py-3 text-lg font-bold text-[#2d2d2d]">
                Khoảng giá
              </h2>
              <PriceRangeFilter 
                priceRange={priceRange} 
                onPriceChange={setPriceRange} 
                maxPrice={maxPrice} 
                minPrice={0} 
              />
            </div>

            {/* Clear All Filters Button */}
            <button 
              onClick={() => {
                setSelectedCategory(null);
                setPriceRange([0, maxPrice || 10000000]);
                setSearchQuery("");
                setSearchInput("");
                setSortBy("default");
                setPage(0);
              }}
              className="w-full rounded-full bg-[#FF6B6B] px-6 py-3 font-semibold text-white hover:bg-[#102937] hover:text-white transition-colors cursor-pointer"
            >
              Xóa tất cả lọc
            </button>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Top Bar */}
            <div className="mb-8 flex items-center justify-between rounded-2xl bg-[#F5E6D3] px-6 py-4">
              <span className="text-[#2d2d2d] font-medium">Hiển thị {pets.length > 0 ? ((page * pageSize) + 1) : 0}–{Math.min((page + 1) * pageSize, totalElements)} trong {totalElements} kết quả</span>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-[#2d2d2d] hover:text-[#FF6B6B] transition-colors">
                  <span>Bộ lọc</span>
                  <ChevronDown size={18} />
                </button>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  >
                    <option value="default">Sắp xếp mặc định</option>
                    <option value="price-low">Giá: Thấp đến cao</option>
                    <option value="price-high">Giá: Cao đến thấp</option>
                    <option value="rating">Đánh giá: Cao đến thấp</option>
                    <option value="latest">Mới nhất</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {pets.length === 0 ? (
              // Empty state - Không tìm thấy thú cưng
              <div className="flex flex-col items-center justify-center py-20">
                <div className="mb-8">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="120" 
                    height="120" 
                    fill="none"
                    className="text-[#A0694B]"
                  >
                    <path 
                      fill="currentColor" 
                      d="M60 0C26.863 0 0 26.863 0 60s26.863 60 60 60 60-26.863 60-60S93.137 0 60 0Zm19.355 40.645a7.742 7.742 0 0 1 7.742 7.742 7.742 7.742 0 0 1-7.742 7.742 7.742 7.742 0 0 1-7.742-7.742 7.742 7.742 0 0 1 7.742-7.742ZM36.774 98.71c-6.41 0-11.613-5.081-11.613-11.355 0-4.84 6.892-14.606 10.065-18.806a1.927 1.927 0 0 1 3.096 0c3.173 4.2 10.065 13.966 10.065 18.806 0 6.274-5.203 11.355-11.613 11.355Zm3.871-42.581a7.742 7.742 0 0 1-7.742-7.742 7.742 7.742 0 0 1 7.742-7.742 7.742 7.742 0 0 1 7.742 7.742 7.742 7.742 0 0 1-7.742 7.742Zm41.161 37.29A28.403 28.403 0 0 0 60 83.226c-5.129 0-5.129-7.742 0-7.742a36.013 36.013 0 0 1 27.742 13.032c3.337 3.968-2.71 8.826-5.936 4.903Z"
                    />
                  </svg>
                </div>
                
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-700 mb-4">Không có thú cưng nào</h2>
                  <p className="text-gray-500 text-lg">
                    {shouldUseSearch 
                      ? "Không tìm thấy thú cưng nào phù hợp với tiêu chí bạn tìm kiếm" 
                      : "Hiện chưa có thú cưng nào trong danh sách"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {pets.map((pet) => (
                  <ProductCard
                    key={pet.petId}
                    product={{
                      petId: pet.petId,
                      name: pet.name,
                      price: pet.price,
                      discountPrice: pet.discountPrice || undefined,
                      rating: pet.rating || undefined,
                      image: getThumbnail(pet.petId, pet.mainImageUrl || null),
                      isSale: !!pet.discountPrice
                    }}
                    onAddToCart={() => {
                      addItem({ pet: pet, quantity: 1, img: getThumbnail(pet.petId, pet.mainImageUrl || null) });
                      openMiniCart();
                    }}
                    onBuyNow={() => {
                      addItem({ pet: pet, quantity: 1, img: getThumbnail(pet.petId, pet.mainImageUrl || null) });
                    }}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex gap-3 justify-center">
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
                    className={`w-10 h-10 rounded-full ${num === page ? "bg-[#FF6B6B] text-white" : "bg-white text-gray-600 hover:border-[#FF6B6B] hover:text-[#FF6B6B]"} border-2 ${num === page ? "border-[#FF6B6B]" : "border-gray-300"} flex items-center justify-center transition-all duration-300`}
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
          </main>
        </div>
      </div>
     
      <MiniCart />
    </>
  );
}