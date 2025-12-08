"use client";

import React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  Phone, 
  PawPrint, 
  Sparkles,
  Heart,
  Loader2
} from "lucide-react";
import { Loading } from "@/app/components/loading";
import { useServiceDetail } from "@/hook/useSevices";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  
  const serviceId = params?.id as string;

  
  const { data: service, isLoading, isError } = useServiceDetail(serviceId);

  
  const commitments = [
    "Đội ngũ bác sĩ thú y giàu kinh nghiệm, tận tâm.",
    "Trang thiết bị hiện đại, môi trường vô trùng.",
    "Quy trình chăm sóc chuẩn quốc tế.",
    "Hỗ trợ tư vấn dinh dưỡng miễn phí.",
    "Đặt lịch hẹn dễ dàng, không phải chờ đợi lâu."
  ];

  
  const handleBookNow = () => {
    router.push("/?action=booking");
  };

  
  if (isLoading) return (<div className="h-screen flex flex-col justify-center items-center bg-[#FDF5F0]">
        <Loader2 className="animate-spin text-[#FF6B6B] w-12 h-12" />
        <p className="mt-4 text-[#5A3E2B] font-bold animate-pulse">Đang tìm thông tin của tin tức...</p>
    </div>)
  
  
  if (isError || !service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FFFAF0] gap-4">
        <PawPrint size={60} className="text-[#FF6B6B] animate-bounce" />
        <h2 className="text-2xl font-bold text-[#8B4513]">Không tìm thấy dịch vụ này!</h2>
        <Link 
          href="/services"
          className="px-6 py-2 bg-[#FF6B6B] text-white rounded-full font-bold hover:bg-[#ff5252] transition-colors"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  
  return (
    <main className="min-h-screen bg-[#FFFAF0] relative overflow-hidden font-sans pb-20">
      
      
      <div className="absolute top-20 right-[-50px] text-[#FFD1DC] opacity-40 rotate-12 pointer-events-none"><PawPrint size={200} /></div>
      <div className="absolute bottom-40 left-[-50px] text-[#FFD1DC] opacity-40 -rotate-12 pointer-events-none"><PawPrint size={150} /></div>

      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-[#8B4513] font-bold hover:text-[#FF6B6B] transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-[#F5E6D3] hover:shadow-md"
        >
          <ArrowLeft size={18} />
          Quay lại dịch vụ
        </Link>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl border-4 border-[#fff0f5] relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-[2rem] border-4 border-[#F5E6D3] group shadow-lg aspect-[4/3]">
                 
                 <Image
                  src={service.imageUrl || "/assets/imgs/imgService/service1.png"}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                
                {service.price && (
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border-2 border-[#FF6B6B] animate-in fade-in zoom-in duration-500">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Chi phí dự kiến</p>
                    <p className="text-xl md:text-2xl font-extrabold text-[#FF6B6B]">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                    </p>
                  </div>
                )}
              </div>

              
              <div className="grid grid-cols-2 gap-4">
                 <div className="rounded-2xl overflow-hidden h-32 border-2 border-[#F5E6D3] relative">
                    <Image src="/assets/imgs/imgPet/cat-2603300_1280.jpg" alt="Decor 1" fill className="object-cover"/>
                 </div>
                 <div className="rounded-2xl overflow-hidden h-32 border-2 border-[#F5E6D3] relative">
                    <Image src="/assets/imgs/imgPet/dog-4988985_1280.jpg" alt="Decor 2" fill className="object-cover"/>
                 </div>
              </div>
            </div>

            
            <div className="flex flex-col justify-center">
              
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-[#FFF0F5] px-4 py-1 rounded-full mb-4">
                   <Sparkles size={16} className="text-[#FF6B6B] animate-spin-slow" />
                   <span className="text-[#FF6B6B] font-bold text-sm uppercase">Dịch vụ cao cấp</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-[#5A3E2B] mb-4 leading-tight">
                  {service.name}
                </h1>
                <div className="h-1.5 w-24 bg-[#FF6B6B] rounded-full"></div>
              </div>

              <div className="prose prose-lg text-gray-600 mb-8 leading-relaxed">
                <p>{service.description}</p>
                <p className="mt-4 text-sm italic text-gray-500 bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
                  * Chúng tôi cam kết mang lại trải nghiệm tốt nhất cho thú cưng của bạn với sự nhẹ nhàng và chuyên nghiệp.
                </p>
              </div>

              
              <div className="bg-[#FFF9F5] rounded-3xl p-6 border-2 border-[#FFE4D6] mb-8">
                <h3 className="font-bold text-[#8B4513] mb-4 flex items-center gap-2">
                   <Heart className="fill-[#FF6B6B] text-[#FF6B6B]" size={20} />
                   Tại sao chọn chúng tôi?
                </h3>
                <ul className="space-y-3">
                  {commitments.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle2 className="text-[#FF6B6B] flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              
              <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                    onClick={handleBookNow}
                    className="flex-1 bg-[#FF6B6B] hover:bg-[#ff5252] text-white py-4 px-6 rounded-2xl font-bold shadow-lg shadow-red-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                 >
                    <Calendar size={20} />
                    Đặt Lịch Ngay
                 </button>
                 <button  className="flex-1 bg-white hover:bg-gray-50 text-[#5A3E2B] border-2 border-[#F5E6D3] py-4 px-6 rounded-2xl font-bold transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                    <Phone size={20} />
                    Liên Hệ Tư Vấn
                 </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}