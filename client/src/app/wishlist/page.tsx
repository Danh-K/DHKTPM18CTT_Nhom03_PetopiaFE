"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/useCartStore"; 
import { Heart, ShoppingBag, Trash2, PawPrint, Sparkles, AlertCircle } from "lucide-react";
import MiniCart from "@/app/carts/_components/MiniCart";
import ProductCard from "@/app/pets/_components/ProductCard";
import { useMyWishlist, useToggleWishlist } from "@/hook/useWishlist";
import { Loading } from "@/app/components/loading";
import { Pet  } from "@/types/Pet";

export default function WishlistPage() {
  const { data: wishlistItems = [], isLoading } = useMyWishlist();
  const { mutate: toggleWishlist } = useToggleWishlist();
  const { addItem, openMiniCart } = useCart();

  
  const getThumbnail = (imgUrl: string | null) => {
    if (imgUrl && (imgUrl.startsWith('http') || imgUrl.startsWith('/'))) {
      return imgUrl;
    }
    return "/assets/imgs/imgPet/cat-6593947_1280.jpg";
  };

  const handleRemove = (petId: string, e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    toggleWishlist(petId);
  };

  if (isLoading) return <Loading />;

  return (
    <>
     
      <div className="relative py-16 w-full bg-[#FDF5F0] overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] text-[#FF6B6B] opacity-10 rotate-12"><PawPrint size={200} /></div>
        <div className="absolute bottom-[-20px] left-[5%] text-[#FF6B6B] opacity-10 -rotate-12"><PawPrint size={120} /></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-4 animate-bounce border-2 border-[#FFE4E1]">
            <Heart className="text-[#FF6B6B] fill-[#FF6B6B]" size={36} />
          </div>
          <h1 className="font-bold text-5xl text-[#5A3E2B] mb-3 drop-shadow-sm font-sans">Góc Yêu Thích</h1>
          <p className="text-lg text-[#8B6E5B]">Nơi lưu giữ những bé cưng mà bạn đã trót yêu nè! 🥰</p>
        </div>
      </div>

     
      <div className="mx-auto max-w-7xl px-6 py-12 min-h-[50vh]">
        
        {wishlistItems.length === 0 ? (
          
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[3rem] border-4 border-dashed border-[#F5E6D3] text-center px-4">
             <div className="relative mb-6">
                <Heart size={80} className="text-[#FF6B6B]/50 mx-auto" />
             </div>
            <h2 className="text-2xl font-bold text-[#5A3E2B] mb-2">Chưa có bé nào trong tim bạn sao?</h2>
            <Link href="/pets" className="group relative inline-flex items-center gap-2 rounded-full bg-[#FF6B6B] px-8 py-3 text-lg font-bold text-white shadow-xl transition-all hover:bg-[#ff5252] hover:scale-105">
              <ShoppingBag size={22} className="group-hover:-translate-y-1 transition-transform" />
              Đi xem thú cưng
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 bg-[#FFF0F5] px-4 py-2 rounded-2xl border border-[#FFB6C1]">
                    <Heart className="w-5 h-5 text-[#FF6B6B] fill-[#FF6B6B]" />
                    <span className="text-[#5A3E2B] font-bold">Đang thích: {wishlistItems.length} bé</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {wishlistItems.map((item) => {
                
                const isAvailable = item.petStatus === 'AVAILABLE' || !item.petStatus; 

                return (
                  <div key={item.wishlistId} className={`relative group transition-transform duration-300 ${isAvailable ? 'hover:-translate-y-2' : 'opacity-70 grayscale-[0.5]'}`}>
                      
                     
                      <ProductCard
                          product={{
                              petId: item.petId,
                              name: item.petName,   
                              price: item.petPrice, 
                              discountPrice: undefined, 
                              rating: 5,            
                              image: getThumbnail(item.petImage), 
                              isSale: false
                          }}
                          
                          onAddToCart={isAvailable ? () => {
                              
                              addItem({ 
                                pet: { petId: item.petId, name: item.petName, price: item.petPrice } as Pet, 
                                quantity: 1, 
                                img: getThumbnail(item.petImage) 
                              });
                              openMiniCart();
                          } : () => {}}
                          
                          onBuyNow={isAvailable ? () => {
                              addItem({ 
                                pet: { petId: item.petId, name: item.petName, price: item.petPrice } as Pet, 
                                quantity: 1, 
                                img: getThumbnail(item.petImage) 
                              });
                          } : undefined}
                      />

                     
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-xl pointer-events-none">
                           <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                              <AlertCircle size={14}/> {item.petStatus === 'SOLD' ? 'Đã bán' : 'Hết hàng'}
                           </div>
                        </div>
                      )}
                      
                     
                      <button
                          onClick={(e) => handleRemove(item.petId, e)}
                          className="absolute top-4 right-4 z-20 bg-white p-2.5 rounded-full shadow-md border border-gray-100 text-gray-400 hover:text-white hover:bg-[#FF6B6B] hover:border-[#FF6B6B] transition-all duration-300 transform group-hover:scale-100 scale-95 opacity-0 group-hover:opacity-100"
                          title="Bỏ thích"
                      >
                          <Trash2 size={18} />
                      </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <MiniCart />
    </>
  );
}