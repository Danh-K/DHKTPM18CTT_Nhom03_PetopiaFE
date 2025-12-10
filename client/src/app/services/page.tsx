"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShopServices } from "@/hook/useSevices";
import { Loading } from "@/app/components/loading";
import { 
  PawPrint, 
  Heart, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Loader2
} from "lucide-react";

export default function ServicesPage() {
  return (
    <>
      
      <div className="relative py-24 w-full">
        <div className="absolute inset-0">
          <Image 
            src="/assets/imgs/imgService/bc-service.jpg"
            alt="Service Background"
            fill
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-center font-extrabold text-6xl text-white drop-shadow-xl flex items-center justify-center gap-4">
            <PawPrint className="text-[#FF6B6B] animate-bounce" size={48} />
            Dịch Vụ Của Chúng Tôi
            <PawPrint className="text-[#FF6B6B] animate-bounce delay-100" size={48} />
          </h1>
        </div>
      </div>
      
      
      <ServiceSection />
    </>
  );
}

export function ServiceSection() {
  const { data: services, isLoading, isError, error } = useShopServices();

  // --- 1. STATE QUẢN LÝ FILTER ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default"); // default, price-asc, price-desc, name-asc

  // --- 2. LOGIC LỌC & SẮP XẾP (useMemo) ---
  const filteredServices = useMemo(() => {
    if (!services) return [];

    let result = [...services];

    // Lọc theo tên
    if (searchTerm.trim()) {
      result = result.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sắp xếp
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [services, searchTerm, sortOption]);

  // --- RENDER ---
  if (isLoading) return (<div className="h-screen flex flex-col justify-center items-center bg-[#FDF5F0]">
        <Loader2 className="animate-spin text-[#FF6B6B] w-12 h-12" />
        <p className="mt-4 text-[#5A3E2B] font-bold animate-pulse">Đang tìm dịch vụ cần thiết cho bạn...</p>
    </div>)
  if (isError) return <div className="text-center py-10 text-red-500 bg-red-50 m-4 rounded-xl">Lỗi: {error.message}</div>;

  return (
    <section className="py-16 px-4 bg-[#FFFAF0] relative overflow-hidden">
      
      
      <div className="absolute top-10 left-10 text-[#FFD1DC] opacity-30 rotate-12 pointer-events-none animate-pulse"><PawPrint size={120} /></div>
      <div className="absolute bottom-10 right-10 text-[#FFD1DC] opacity-30 -rotate-12 pointer-events-none animate-pulse delay-300"><PawPrint size={100} /></div>

      <div className="mx-auto max-w-7xl relative z-10">
        
        
        <div className="text-center mb-10">
          <div className="inline-block relative">
             <h2 className="text-4xl md:text-5xl font-extrabold text-[#8B4513] mb-4 drop-shadow-sm relative z-10">
               DỊCH VỤ HÀNG ĐẦU
             </h2>
             <Heart className="absolute -top-5 -left-8 text-[#FF6B6B] fill-[#FF6B6B] animate-bounce" size={30} />
             <Sparkles className="absolute -bottom-2 -right-8 text-yellow-400 animate-spin-slow" size={30} />
          </div>
          <p className="text-[#A07B65] max-w-2xl mx-auto font-medium mt-2">
            Đội ngũ chuyên gia giàu kinh nghiệm, đảm bảo an toàn và hạnh phúc cho Boss yêu 🐶🐱
          </p>
        </div>

        
        <div className="mb-12 bg-white p-4 rounded-3xl shadow-md border-2 border-[#F5E6D3] flex flex-col md:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">
            
            
            <div className="relative w-full md:w-2/3 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF6B6B] transition-colors" size={20} />
                <input 
                    type="text"
                    placeholder="Tìm kiếm dịch vụ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#FFF5F5] border-2 border-transparent focus:border-[#FF6B6B] rounded-2xl outline-none text-[#5A3E2B] placeholder-gray-400 transition-all font-medium"
                />
            </div>

            
            <div className="relative w-full md:w-1/3">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6B6B] pointer-events-none">
                    <Filter size={18} />
                </div>
                <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 bg-white border-2 border-[#F5E6D3] hover:border-[#FF6B6B] focus:border-[#FF6B6B] rounded-2xl outline-none text-[#5A3E2B] font-bold appearance-none cursor-pointer transition-all"
                >
                    <option value="default">✨ Mặc định</option>
                    <option value="price-asc">💰 Giá thấp đến cao</option>
                    <option value="price-desc">💎 Giá cao đến thấp</option>
                    <option value="name-asc">🔤 Tên A-Z</option>
                </select>
                <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
        </div>

        
        {filteredServices.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-[#F5E6D3]">
                <PawPrint size={60} className="mx-auto text-gray-300 mb-4" />
                <p className="text-[#8B4513] font-medium text-lg">Không tìm thấy dịch vụ nào cho {searchTerm}</p>
                <button 
                    onClick={() => { setSearchTerm(""); setSortOption("default"); }}
                    className="mt-4 text-[#FF6B6B] font-bold hover:underline"
                >
                    Xóa bộ lọc
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
                <div
                key={service.serviceId}
                className="group bg-[#f5e6d3] rounded-[2.5rem] p-6 flex gap-4 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 border-4 border-transparent hover:border-[#FF7B7B]"
                >
                
                <div className="absolute inset-0 bg-[#ff7b7b] rounded-[2.5rem] scale-0 origin-bottom-left transition-transform duration-500 ease-out group-hover:scale-150 z-0"></div>
                
                
                <div className="flex-shrink-0 relative z-10">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md group-hover:bg-white transition-colors duration-300 overflow-hidden">
                          <Image
                            src={service.imageUrl || '/assets/imgs/imgService/service1.png'}
                            alt={service.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                </div>

                
                <div className="flex flex-col justify-between relative z-10 w-full">
                    <div>
                    <h3 className="text-xl font-bold text-[#1a3a52] group-hover:text-white mb-2 transition-colors duration-300 line-clamp-2">
                        {service.name}
                    </h3>
                    <p className="text-gray-600 group-hover:text-white/90 text-sm transition-colors duration-300 line-clamp-3">
                        {service.description}
                    </p>
                    
                    {service.price && (
                        <p className="text-[#8B4513] group-hover:text-yellow-200 font-extrabold mt-2 transition-colors duration-300">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                        </p>
                    )}
                    </div>

                    <Link 
                    href={`/services/${service.serviceId}`} 
                    className="text-[#ff7b7b] group-hover:text-white font-bold text-sm bg-white/0 group-hover:bg-white/20 rounded-full px-0 group-hover:px-4 py-1 w-fit mt-3 transition-all duration-300 cursor-pointer flex items-center gap-1"
                    >
                    TÌM HIỂU THÊM <Sparkles size={12} />
                    </Link>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </section>
  );
}