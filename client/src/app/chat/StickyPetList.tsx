"use client";

import Image from "next/image";
import { X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/useChatStore";

export default function StickyPetList() {
  const { recommendations, clearRecommendations, setOpen } = useChatStore();
  const router = useRouter();

  if (!recommendations || recommendations.length === 0) return null;

  const handleViewDetail = (petId: string) => {
    // Chuyển hướng và đóng chat (hoặc giữ mở tùy bạn)
    router.push(`/pets/${petId}`);
    // setOpen(false); // Nếu muốn đóng chat khi bấm
  };

  return (
    <div className="bg-white border-b border-[#F5E6D3] shadow-sm relative animate-in slide-in-from-top duration-300">
      
      {/* Header nhỏ của thanh ghim */}
      <div className="flex justify-between items-center px-4 py-1 bg-[#FFF5F5]">
        <span className="text-[10px] font-bold text-[#FF6B6B] uppercase tracking-wider">
          ✨ Gợi ý cho Sen nè
        </span>
        <button onClick={clearRecommendations} className="text-gray-400 hover:text-red-500">
          <X size={14} />
        </button>
      </div>

      {/* Danh sách cuộn ngang */}
      <div className="flex gap-3 overflow-x-auto p-3 scrollbar-hide">
        {recommendations.map((pet: any) => (
          <div 
            key={pet.petId} 
            className="flex-shrink-0 w-32 bg-white border border-[#F5E6D3] rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all group"
            onClick={() => handleViewDetail(pet.petId)}
          >
            <div className="relative h-20 w-full">
              <Image 
                src={pet.mainImageUrl || pet.image || "/assets/imgs/imgPet/animal-8165466_1280.jpg"}
                alt={pet.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-2">
              <h4 className="text-xs font-bold text-[#5A3E2B] line-clamp-1 group-hover:text-[#FF6B6B]">
                {pet.name}
              </h4>
              <p className="text-[#FF6B6B] text-[10px] font-bold mt-0.5">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pet.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}