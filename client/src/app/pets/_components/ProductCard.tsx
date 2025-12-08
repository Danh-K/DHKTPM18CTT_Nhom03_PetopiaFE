"use client"

import { ShoppingCart, Star, Heart } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { useCart } from "@/store/useCartStore" 
import { toast } from "sonner" 


import { useMyWishlist, useToggleWishlist } from "@/hook/useWishlist"

interface Product {
  petId: string
  name: string
  price: number
  discountPrice?: number
  rating?: number
  image: string
  isSale?: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart: () => void
  onBuyNow?: () => void
}

export default function ProductCard({ product, onAddToCart, onBuyNow }: ProductCardProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  
  
  const { data: wishlistItems } = useMyWishlist()
  
  
  const { mutate: toggleWishlist } = useToggleWishlist()

  
  const isInWishlist = Array.isArray(wishlistItems) && wishlistItems.some((item: any) => item.petId === product.petId)

  
  const ratingValue = typeof product.rating === 'number' ? product.rating : 0
  const filledStars = Math.floor(ratingValue)

  const handleCardClick = () => {
    router.push(`/pets/${product.petId}`)
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onBuyNow) {
      onBuyNow()
      router.push('/carts')
    } else {
      router.push(`/pets/${product.petId}`)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart()
  }

  
  const handleToggleHeart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (!isAuthenticated) {
        toast.error("Bạn cần đăng nhập để thực hiện chức năng này!")
        return
    }

    
    toggleWishlist(product.petId, {
      onSuccess: (data) => {
         
         if (data === "Added") {
            toast.success("Đã thêm vào danh sách yêu thích ❤️")
         } else {
            toast.info("Đã xóa khỏi danh sách yêu thích 💔")
         }
      },
      onError: (err: any) => {
         
         const msg = err?.response?.data?.message || "Có lỗi xảy ra"
         toast.error(msg)
      }
    })
  }

  return (
    <div 
      onClick={handleCardClick}
      className="group rounded-2xl bg-[#fff0f0] p-4 shadow-lg hover:shadow-xl hover:bg-[#FF6B6B] transition-all duration-300 relative cursor-pointer"
    >
     
      <div 
        className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer"
        onClick={handleToggleHeart}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-[#102937] transition-colors duration-300 ${
          isInWishlist ? 'bg-red-500' : 'bg-[#FF6B6B]'
        }`}>
          <Heart 
            size={18} 
            className={`text-white transition-colors ${isInWishlist ? 'fill-white' : ''}`}
          />
        </div>
      </div>

     
      <div 
        className="absolute top-6 left-18 ml-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer"
        onClick={handleAddToCart}
      >
        <div className="w-10 h-10 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-md hover:bg-[#102937] transition-colors duration-300">
          <ShoppingCart size={18} className="text-white" />
        </div>
      </div>

     
      <div className="relative mb-4 overflow-hidden rounded-xl bg-[#F5E6D3]">
        <Image
          src={product.image || "/assets/imgs/imgPet/animal-8165466_1280.jpg"}
          alt={product.name}
          width={300}
          height={256}
          className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {(product.discountPrice || product.isSale) && (
          <div className="absolute right-3 top-3 rounded-full bg-[#FF6B6B] px-3 py-1 text-xs font-bold text-white">
            GIẢM GIÁ
          </div>
        )}
      </div>

     
      <div className="mb-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < filledStars ? "fill-yellow-400 text-yellow-400" : "text-gray-300 group-hover:text-white"}
          />
        ))}
      </div>

     
      <h3 className="mb-2 font-bold text-[#2d2d2d] group-hover:text-white text-lg line-clamp-2 transition-colors duration-300">
        {product.name}
      </h3>

     
      <div className="mb-4 flex items-center gap-2">
        {product.discountPrice ? (
          <>
            <span className="text-[#2d2d2d] group-hover:text-white font-bold text-xl transition-colors duration-300">
              {product.discountPrice.toLocaleString('vi-VN')}₫
            </span>
            <span className="text-gray-400 group-hover:text-white line-through text-sm transition-colors duration-300">
              {product.price.toLocaleString('vi-VN')}₫
            </span>
          </>
        ) : (
          <span className="text-[#2d2d2d] group-hover:text-white font-bold text-xl transition-colors duration-300">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
        )}
      </div>

     
      <button 
        onClick={handleBuyNow}
        className="w-full bg-[#FF6B6B] group-hover:bg-[#102937] text-white py-3 px-4 rounded-lg transition-colors duration-300 font-semibold cursor-pointer hover:cursor-pointer"
      >
        Mua ngay
      </button>
    </div>
  )
}