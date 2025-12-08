"use client";
import React from "react";
import Image from "next/image";
// import { trpc } from "@/lib/utils/trpc";
import { Loading } from "../../components/loading";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCartStore";
import MiniCart from "@/app/carts/_components/MiniCart";
import type { Pet } from "@/types/Pet";
import { usePets } from "@/hook/usePets";
import { toast } from "sonner";

// Import Hooks Wishlist bạn vừa cung cấp
// Hãy đảm bảo đường dẫn import đúng với nơi bạn lưu file hooks này
import { useMyWishlist, useToggleWishlist } from "@/hook/useWishlist"; 

export default function ProductSection() {
  const { data: pets, isLoading, error } = usePets();
  
 
  const { data: wishlistItems } = useMyWishlist();
  const { mutate: toggleWishlist } = useToggleWishlist();

  const { addItem, openMiniCart } = useCart();
  const router = useRouter();

 
  const checkIsLiked = (petId: string) => {
    if (!wishlistItems || !Array.isArray(wishlistItems)) return false;
    return wishlistItems.some((item: any) => item.petId === petId);
  };

 
  const handleToggleHeart = (e: React.MouseEvent, petId: string) => {
    e.stopPropagation();
    e.preventDefault();

    toggleWishlist(petId, {
      onSuccess: (data) => {
        
         if (data === "Added") {
            toast.success("Đã thêm vào danh sách yêu thích ❤️");
         } else {
            toast.info("Đã xóa khỏi danh sách yêu thích 💔");
         }
      },
      onError: () => {
         toast.error("Bạn cần đăng nhập để thực hiện chức năng này!");
      }
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-10 text-red-500">Lỗi: {error.message}</div>;

  const productList: Pet[] = (Array.isArray(pets) ? pets : Object.values(pets ?? {})) as Pet[];
  const products = productList.slice(0, 6);

  return (
    <section className="py-16 px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl text-[#8B4513] mb-4 font-bold">SẢN PHẨM NỔI BẬT</h2>
          <div className="h-1 w-20 bg-[#FF6B6B] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
           
            const isLiked = checkIsLiked(product.petId);

            return (
              <div 
                key={product.petId}
                onClick={() => router.push(`/pets/${product.petId}`)}
                className="group rounded-3xl bg-white border border-[#F5E6D3] p-4 shadow-md hover:shadow-xl hover:bg-[#FF6B6B] transition-all duration-300 relative cursor-pointer overflow-hidden"
              >
                
                {/* --- Wishlist Button --- */}
                <div 
                    onClick={(e) => handleToggleHeart(e, product.petId)}
                    className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 cursor-pointer transform translate-y-4 group-hover:translate-y-0"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#102937] group/btn transition-colors duration-300">
                    <Heart 
                        size={18} 
                        className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-[#FF6B6B] group-hover/btn:text-white'}`} 
                    />
                  </div>
                </div>

                {/* --- Add to Cart Button --- */}
                <div 
                  className="absolute top-6 left-18 ml-12 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 z-20 cursor-pointer transform translate-y-4 group-hover:translate-y-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem({ pet: product as Pet, quantity: 1, img: product.mainImageUrl || "" });
                    openMiniCart();
                    toast.success("Đã thêm vào giỏ hàng 🛒");
                  }}
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#102937] group/btn transition-colors duration-300">
                    <ShoppingCart size={18} className="text-[#FF6B6B] group-hover/btn:text-white" />
                  </div>
                </div>

                {/* --- Image --- */}
                <div className="relative mb-4 overflow-hidden rounded-2xl bg-[#F5E6D3]">
                  <Image
                    src={product.mainImageUrl || "/assets/imgs/imgPet/animal-8165466_1280.jpg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.discountPrice && (
                    <div className="absolute right-3 top-3 rounded-full bg-[#FF6B6B] px-3 py-1 text-xs font-bold text-white shadow-sm">
                      GIẢM GIÁ
                    </div>
                  )}
                </div>

                {/* --- Content --- */}
                <div className="px-2">
                    <div className="mb-2 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                        key={i}
                        size={14}
                        className={i < (product.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 group-hover:text-white/70"}
                        />
                    ))}
                    </div>

                    <h3 className="mb-2 font-bold text-[#2d2d2d] group-hover:text-white text-lg line-clamp-1 transition-colors duration-300">
                        {product.name}
                    </h3>

                    <div className="mb-4 flex items-center gap-2">
                    {product.discountPrice ? (
                        <>
                        <span className="text-[#FF6B6B] group-hover:text-white font-bold text-xl transition-colors duration-300">
                            {product.discountPrice.toLocaleString('vi-VN')}₫
                        </span>
                        <span className="text-gray-400 group-hover:text-white/80 line-through text-sm transition-colors duration-300">
                            {product.price?.toLocaleString('vi-VN')}₫
                        </span>
                        </>
                    ) : (
                        <span className="text-[#FF6B6B] group-hover:text-white font-bold text-xl transition-colors duration-300">
                            {product.price?.toLocaleString('vi-VN')}₫
                        </span>
                    )}
                    </div>

                    <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/pets/${product.petId}`);
                    }}
                    className="w-full bg-[#F5E6D3] text-[#8B4513] group-hover:bg-white group-hover:text-[#FF6B6B] py-3 px-4 rounded-xl transition-colors duration-300 font-bold cursor-pointer hover:shadow-lg"
                    >
                    Xem chi tiết
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <MiniCart />
    </section>
  );
}