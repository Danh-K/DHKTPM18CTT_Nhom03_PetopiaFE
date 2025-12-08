"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Heart, Minus, Plus, Star, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/store/useCartStore"
import { useFavorite } from "@/store/useFavoriteStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useToast } from "@/hook/useToast"
import { Loading } from "@/app/components/loading"
import Image from "next/image"
import MiniCart from "@/app/carts/_components/MiniCart"
import ReviewSection from "@/app/pets/_components/ReviewSection"
import useSWR from "swr"
import axiosInstance from "@/lib/utils/axios"
import type { Pet } from "@/types/Pet"

// Interface cho API Response từ backend
interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

// Interface cho Pet chi tiết từ backend
interface PetDetailDTO {
  petId: string;
  name: string;
  description?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  age?: number | null;
  gender?: "MALE" | "FEMALE" | "UNKNOWN" | null;
  price: number;
  discountPrice?: number | null;
  healthStatus?: string | null;
  vaccinationHistory?: string | null;
  stockQuantity?: number | null;
  status?: "AVAILABLE" | "SOLD" | "RESERVED" | "DRAFT" | null;
  videoUrl?: string | null;
  weight?: number | null;
  height?: number | null;
  color?: string | null;
  furType?: "SHORT" | "LONG" | "CURLY" | "NONE" | "OTHER" | null;
  mainImageUrl?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

// Hàm format rating: nếu phần thập phân từ 0.1 đến 0.9 thì làm tròn xuống
const formatRating = (rating: number | null | undefined): string => {
  if (!rating) return "0";
  
  const decimal = rating % 1; // Lấy phần thập phân
  if (decimal >= 0.1 && decimal <= 0.9) {
    return Math.floor(rating).toString(); // Làm tròn xuống (2.1 → 2, 2.5 → 2, 2.9 → 2)
  }
  // Nếu là số nguyên (decimal = 0) thì hiển thị số nguyên
  if (decimal === 0) {
    return Math.floor(rating).toString(); // 3.0 → 3
  }
  return rating.toFixed(1); // Trường hợp khác (hiếm khi xảy ra)
};

// Fetcher cho SWR (dùng axiosInstance)
const fetcher = async (url: string): Promise<PetDetailDTO> => {
  try {
    const response = await axiosInstance.get<ApiResponse<PetDetailDTO>>(url);
    const apiResponse = response.data;
    
    if (apiResponse.status !== 200 || !apiResponse.data) {
      throw new Error(apiResponse.message || 'Không tìm thấy thú cưng');
    }
    
    return apiResponse.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    throw new Error(err.response?.data?.message || err.message || 'Không tìm thấy thú cưng');
  }
};

export default function PetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const petId = params.id as string
  
  const [quantity, setQuantity] = useState(1)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)
  
  const { addItem, openMiniCart } = useCart()
  const { addItem: addToFavorite, removeItem: removeFromFavorite, isFavorite } = useFavorite()
  const { isAuthenticated } = useAuthStore()
  const { success, error: showError, ToastContainer } = useToast()
  
  const isWishlisted = isFavorite(petId)
  
  // Fetch pet data từ backend API (dùng axiosInstance với relative path)
  const { data: pet, error, isLoading } = useSWR<PetDetailDTO>(
    `/pets/${petId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );
  
  // Debug: log rating & reviewCount lấy từ backend
  if (pet) {
    console.log("[PetDetail] Rating data:", {
      petId,
      rating: pet.rating,
      reviewCount: pet.reviewCount,
    });
  }
  
  if (isLoading) return (<div className="h-screen flex flex-col justify-center items-center bg-[#FDF5F0]">
        <Loader2 className="animate-spin text-[#FF6B6B] w-12 h-12" />
        <p className="mt-4 text-[#5A3E2B] font-bold animate-pulse">Đang tìm thông tin thú cưng...</p>
    </div>)
  
  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 mb-4 text-xl font-semibold">
          {error.message || 'Không tìm thấy thú cưng'}
        </div>
        <button 
          onClick={() => router.push('/pets')}
          className="mt-4 px-6 py-3 bg-[#FF6B6B] text-white rounded-full hover:bg-[#FF5555] transition-colors"
        >
          Quay lại danh sách thú cưng
        </button>
      </div>
    );
  }
  
  if (!pet) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 mb-4 text-xl font-semibold">
          Không tìm thấy thú cưng với ID: {petId}
        </div>
        <button 
          onClick={() => router.push('/pets')}
          className="mt-4 px-6 py-3 bg-[#FF6B6B] text-white rounded-full hover:bg-[#FF5555] transition-colors"
        >
          Quay lại danh sách thú cưng
        </button>
      </div>
    )
  }

  // Xử lý ảnh giống như trang pets
  const getThumbnail = (mainImageUrl: string | null) => {
    if (mainImageUrl) {
      // Chỉ dùng URL đầy đủ
      if (mainImageUrl.startsWith('http://') || mainImageUrl.startsWith('https://')) {
        return mainImageUrl;
      }
      // Nếu bắt đầu bằng / thì là đường dẫn tuyệt đối
      if (mainImageUrl.startsWith('/')) {
        return mainImageUrl;
      }
    }
    // Fallback về ảnh local
    return "/assets/imgs/imgPet/cat-6593947_1280.jpg";
  };

  const thumbnailImage = getThumbnail(pet.mainImageUrl || null);
  const allImages = [thumbnailImage];

  // Convert sang Pet type cho cart
  const convertToPetType = (): Pet => {
    return {
      petId: pet.petId,
      name: pet.name,
      description: pet.description,
      price: pet.price,
      discountPrice: pet.discountPrice,
      stockQuantity: pet.stockQuantity,
      mainImageUrl: pet.mainImageUrl,
      categoryName: pet.categoryName,
      gender: (pet.gender === 'UNKNOWN' || !pet.gender) ? null : pet.gender as "MALE" | "FEMALE",
      healthStatus: pet.healthStatus,
      status: pet.status === 'DRAFT' ? null : pet.status as "AVAILABLE" | "SOLD" | "RESERVED" | null,
      rating: pet.rating,
      reviewCount: pet.reviewCount,
      totalSold: null,
    };
  };

  const handleAddToCart = () => {
    addItem({ 
      pet: convertToPetType(), 
      quantity: quantity, 
      img: thumbnailImage 
    })
    openMiniCart()
  }

  const handleBuyNow = () => {
    addItem({ 
      pet: convertToPetType(), 
      quantity: quantity, 
      img: thumbnailImage 
    })
    // Redirect to cart or checkout page
    router.push('/carts')
  }

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      showError('Chưa đăng nhập', 'Vui lòng đăng nhập để thêm vào yêu thích')
      return
    }

    if (isTogglingWishlist) return

    setIsTogglingWishlist(true)

    try {
      const response = await axiosInstance.post(`/wishlists/toggle/${petId}`)
      
      if (response.data.status === 200) {
        const action = response.data.data // "Added" or "Removed"
        
        if (action === "Added") {
          addToFavorite({
            pet: convertToPetType(),
            img: thumbnailImage,
          })
          success('Đã thêm vào yêu thích', `${pet.name} đã được thêm vào danh sách yêu thích`)
        } else {
          removeFromFavorite(petId)
          success('Đã xóa khỏi yêu thích', `${pet.name} đã được xóa khỏi danh sách yêu thích`)
        }
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err)
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể thêm vào yêu thích'
      showError('Lỗi', errorMessage)
    } finally {
      setIsTogglingWishlist(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <ToastContainer />
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại thú cưng
        </button>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="bg-card border border-border overflow-hidden">
              <div className="aspect-square bg-secondary flex items-center justify-center">
                <Image 
                  src={thumbnailImage} 
                  alt={pet.name} 
                  width={600}
                  height={600}
                  className="w-full h-full object-cover" 
                />
              </div>
            </Card>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.slice(0, 4).map((src: string, idx: number) => (
                  <button
                    key={idx}
                    className={`aspect-square rounded-lg border-2 overflow-hidden transition ${
                      idx === 0 ? "border-primary" : "border-border hover:border-primary"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${pet.name} view ${idx + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3">{pet.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={
                        i < Math.floor(pet.rating || 0)
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                  {pet.rating ? (
                    <>
                      {formatRating(pet.rating)} <Star size={14} className="fill-yellow-400 text-yellow-400" /> ({pet.reviewCount || 0} đánh giá)
                    </>
                  ) : (
                    '(Chưa có đánh giá)'
                  )}
                </span>
              </div>
            </div>

            {/* SKU and Price */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Mã sản phẩm:</span> {pet.petId}
              </p>
              <div className="flex items-center gap-3">
                {pet.discountPrice ? (
                  <>
                    <p className="text-3xl font-bold text-foreground">
                      {pet.discountPrice.toLocaleString('vi-VN')}₫
                    </p>
                    <p className="text-xl text-muted-foreground line-through">
                      {pet.price.toLocaleString('vi-VN')}₫
                    </p>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-semibold">
                      Giảm {Math.round((1 - pet.discountPrice / pet.price) * 100)}%
                    </span>
                  </>
                ) : (
                  <p className="text-3xl font-bold text-foreground">
                    {pet.price.toLocaleString('vi-VN')}₫
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-bold text-foreground text-lg">Mô tả</h3>
              <p className="text-foreground leading-relaxed text-base">
                {pet.description || "Thú cưng đáng yêu và thân thiện, phù hợp cho gia đình. Được chăm sóc tốt và có sức khỏe tốt."}
              </p>
            </div>

            {/* Pet Information */}
            <div className="space-y-3">
              <h3 className="font-bold text-foreground text-lg">Thông tin chi tiết</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {pet.categoryName && (
                  <div>
                    <span className="font-semibold text-muted-foreground">Loại:</span>
                    <span className="ml-2 text-foreground">{pet.categoryName}</span>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-muted-foreground">Giới tính:</span>
                  <span className="ml-2 text-foreground">
                    {pet.gender === 'MALE' ? 'Đực' : pet.gender === 'FEMALE' ? 'Cái' : 'Chưa xác định'}
                  </span>
                </div>
                {pet.age && (
                  <div>
                    <span className="font-semibold text-muted-foreground">Tuổi:</span>
                    <span className="ml-2 text-foreground">{pet.age} tháng</span>
                  </div>
                )}
                {pet.weight && (
                  <div>
                    <span className="font-semibold text-muted-foreground">Cân nặng:</span>
                    <span className="ml-2 text-foreground">{pet.weight} kg</span>
                  </div>
                )}
                {pet.height && (
                  <div>
                    <span className="font-semibold text-muted-foreground">Chiều cao:</span>
                    <span className="ml-2 text-foreground">{pet.height} cm</span>
                  </div>
                )}
                {pet.color && (
                  <div>
                    <span className="font-semibold text-muted-foreground">Màu sắc:</span>
                    <span className="ml-2 text-foreground">{pet.color}</span>
                  </div>
                )}
                {pet.furType && pet.furType !== 'NONE' && (
                  <div>
                    <span className="font-semibold text-muted-foreground">Loại lông:</span>
                    <span className="ml-2 text-foreground">
                      {pet.furType === 'SHORT' ? 'Lông ngắn' : 
                       pet.furType === 'LONG' ? 'Lông dài' : 
                       pet.furType === 'CURLY' ? 'Lông xoăn' : 'Khác'}
                    </span>
                  </div>
                )}
                {pet.healthStatus && (
                  <div>
                    <span className="font-semibold text-muted-foreground">Tình trạng sức khỏe:</span>
                    <span className="ml-2 text-foreground">{pet.healthStatus}</span>
                  </div>
                )}
                {pet.vaccinationHistory && (
                  <div className="col-span-2">
                    <span className="font-semibold text-muted-foreground">Lịch sử tiêm chủng:</span>
                    <span className="ml-2 text-foreground">{pet.vaccinationHistory}</span>
                  </div>
                )}
                {pet.stockQuantity !== null && pet.stockQuantity !== undefined && (
                  <div>
                    <span className="font-semibold text-muted-foreground">Số lượng:</span>
                    <span className="ml-2 text-foreground">{pet.stockQuantity}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Promo Banner */}
            <div className="bg-[#fff7f7] rounded-full p-4 flex items-center gap-3">
              <div className="w-6 h-6 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 66" className="w-full h-full fill-[#ff6262]">
                  <path d="M33,0l6.1,9.5l10.4-5.1L50,15.7l11.6,0.8l-5.2,10L66,33l-9.5,6.1l5.1,10.4L50.3,50l-0.8,11.6l-10-5.2L33,66l-6.1-9.5 l-10.4,5.1L16,50.3L4.4,49.5l5.2-10L0,33l9.5-6.1L4.4,16.5L15.7,16l0.8-11.6l10,5.2L33,0z M41.7,18c-0.5-0.3-1.2-0.1-1.5,0.4 L24,46.5c-0.3,0.5-0.1,1.2,0.4,1.5c0.5,0.3,1.2,0.1,1.5-0.4L42,19.5C42.4,19,42.2,18.3,41.7,18z M43.6,38c-1.1-1.1-2.6-1.8-4.2-1.8 c-1.6,0-3.1,0.7-4.2,1.8s-1.8,2.6-1.8,4.2c0,1.7,0.7,3.1,1.8,4.2c1.1,1.1,2.6,1.7,4.2,1.7c1.7,0,3.1-0.7,4.2-1.7 c1.1-1.1,1.8-2.6,1.8-4.2C45.3,40.5,44.7,39,43.6,38z M42,44.9c-0.7,0.7-1.6,1.1-2.7,1.1c-1,0-2-0.4-2.7-1.1s-1.1-1.7-1.1-2.7 c0-1,0.4-2,1.1-2.7c0.7-0.7,1.6-1.1,2.7-1.1c1.1,0,2,0.4,2.7,1.1c0.7,0.7,1.1,1.6,1.1,2.7S42.7,44.2,42,44.9z M30.9,19.6 c-1.1-1.1-2.6-1.8-4.2-1.8c-1.6,0-3.1,0.7-4.2,1.8c-1.1,1.1-1.7,2.6-1.7,4.2c0,1.6,0.7,3.1,1.7,4.2c1.1,1.1,2.6,1.7,4.2,1.7 c1.7,0,3.1-0.7,4.2-1.7c1.1-1.1,1.8-2.6,1.8-4.2C32.6,22.2,31.9,20.7,30.9,19.6z M29.3,26.5c-0.7,0.7-1.7,1.1-2.7,1.1 c-1,0-2-0.4-2.7-1.1c-0.7-0.7-1.1-1.6-1.1-2.7c0-1.1,0.4-2,1.1-2.7s1.6-1.1,2.7-1.1c1.1,0,2,0.4,2.7,1.1s1.1,1.7,1.1,2.7 C30.5,24.9,30,25.8,29.3,26.5z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#505050]">
                  Miễn phí giao hàng cho đơn hàng trên 2.000.000₫
                </p>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center border border-border rounded-full bg-[#fae5d2]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 cursor-pointer transition"
                  >
                    <Minus size={18} className="text-foreground" />
                  </button>
                  <span className="px-6 font-semibold text-foreground">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 cursor-pointer transition">
                    <Plus size={18} className="text-foreground" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 py-6 text-base font-semibold bg-[#102937] hover:bg-[#0d1f2a] text-white rounded-full transition-colors duration-300 cursor-pointer"
                >
                  Add To Cart
                </Button>

                {/* Wishlist Button */}
                <button
                  onClick={handleToggleWishlist}
                  disabled={isTogglingWishlist}
                  className={`p-4 bg-white border-2 rounded-full transition-all duration-300 cursor-pointer group ${
                    isWishlisted ? 'border-red-500' : 'border-gray-200'
                  } ${isTogglingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Heart 
                    size={20} 
                    className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-red-500"} 
                  />
                </button>
              </div>

              {/* Buy Now Button */}
              <Button 
                onClick={handleBuyNow}
                className="w-full py-6 text-base font-semibold bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-full"
              >
                Mua ngay
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <ReviewSection petId={petId} />
      </div>

      <MiniCart />
    </main>
  )
}