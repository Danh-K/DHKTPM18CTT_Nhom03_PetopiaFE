"use client";
import React from "react";
import Image from "next/image";
import { trpc } from "@/lib/utils/trpc";
import { Loading } from "../../components/loading";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCartStore";
import MiniCart from "@/app/carts/_components/MiniCart";
import type { Pet } from "@/types/Pet";
import { usePets } from "@/hook/usePets";
import { useAllPetImages, usePetImages, useSetThumbnail } from "@/hook/usePetImgs";

export default function ProductSection() {
  const {data: pets, isLoading, error} = usePets();
  const { data: petImgs } = useAllPetImages();
  const { addItem, openMiniCart } = useCart();
  const router = useRouter();

  const getThumbnail = (petId: string) => {
    const img = petImgs?.find((img) => img.petId === petId && img.isThumbnail);
    return img?.imageUrl || "/assets/imgs/imgPet/animal-8165466_1280.jpg";
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-10 text-red-500">Lỗi: {error.message}</div>;
  console.log(pets)

  
  const productList: Pet[] = (Array.isArray(pets) ? pets : Object.values(pets ?? {})) as Pet[];
  const products = productList.slice(0, 5) ;

  return (
    <section className="py-16 px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl text-[#8B4513] mb-4">SẢN PHẨM</h2>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.petId}
              onClick={() => router.push(`/pets/${product.petId}`)}
              className="group rounded-2xl bg-[#fff0f0] p-4 shadow-lg hover:shadow-xl hover:bg-[#FF6B6B] transition-all duration-300 relative cursor-pointer"
            >
              
              <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer">
                <div className="w-10 h-10 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-md hover:bg-[#102937] transition-colors duration-300">
                  <Heart size={18} className="text-white" />
                </div>
              </div>

              
              <div 
                className="absolute top-6 left-18 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  addItem({ pet: product as Pet, quantity: 1, img: product.mainImageUrl });
                  openMiniCart();
                }}
              >
                <div className="w-10 h-10 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-md hover:bg-[#102937] transition-colors duration-300">
                  <ShoppingCart size={18} className="text-white" />
                </div>
              </div>

              
              <div className="relative mb-4 overflow-hidden rounded-xl bg-[#F5E6D3]">
                <Image
                  src={product.mainImageUrl}
                  alt={product.name}
                  width={300}
                  height={256}
                  className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discountPrice && (
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
                    className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300 group-hover:text-white"}
                  />
                ))}
              </div>

              
              <h3 className="mb-2 font-bold text-[#2d2d2d] group-hover:text-white text-lg line-clamp-2 transition-colors duration-300">{product.name}</h3>

              
              <div className="mb-4 flex items-center gap-2">
                {product.discountPrice != null ? (
                  <>
                    <span className="text-[#2d2d2d] group-hover:text-white font-bold text-xl transition-colors duration-300">{(product.discountPrice ?? product.price ?? 0).toLocaleString('vi-VN')}₫</span>
                    {product.price != null && (
                      <span className="text-gray-400 group-hover:text-white line-through text-sm transition-colors duration-300">{(product.price ?? 0).toLocaleString('vi-VN')}₫</span>
                    )}
                  </>
                ) : (
                  <span className="text-[#2d2d2d] group-hover:text-white font-bold text-xl transition-colors duration-300">{(product.price ?? 0).toLocaleString('vi-VN')}₫</span>
                )}
              </div>

              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/pets/${product.petId}`);
                }}
                className="w-full bg-[#FF6B6B] group-hover:bg-[#102937] text-white py-3 px-4 rounded-lg transition-colors duration-300 font-semibold cursor-pointer hover:cursor-pointer"
              >
                Mua ngay
              </button>
            </div>
          ))}
        </div>
      </div>
      <MiniCart />
    </section>
  );
}