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
import { useServiceDetail, useShopServices } from "@/hook/useSevices";

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

  if (isLoading) return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#FDF5F0]">
            <Loader2 className="animate-spin text-[#FF6B6B] w-12 h-12" />
            <p className="mt-4 text-[#5A3E2B] font-bold animate-pulse">Đang tìm chi tiết dịch vụ...</p>
        </div>
  )
  
  if (isError || !service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FFFAF0] gap-4">
        <PawPrint size={60} className="text-[#FF6B6B] animate-bounce" />
        <h2 className="text-2xl font-bold text-[#8B4513]">Không tìm thấy dịch vụ này!</h2>
        <button 
          onClick={() => router.push('/services')}
          className="px-6 py-2 bg-[#FF6B6B] text-white rounded-full font-bold hover:bg-[#ff5252] transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFAF0] relative overflow-hidden font-sans">
      
      
      <div className="absolute top-20 right-[-50px] text-[#FFD1DC] opacity-40 rotate-12 pointer-events-none"><PawPrint size={200} /></div>
      <div className="absolute bottom-40 left-[-50px] text-[#FFD1DC] opacity-40 -rotate-12 pointer-events-none"><PawPrint size={150} /></div>

      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-[#8B4513] font-bold hover:text-[#FF6B6B] transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-[#F5E6D3]"
        >
          <ArrowLeft size={18} />
          Quay lại dịch vụ
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-20 relative z-10">
        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl border-4 border-[#fff0f5] relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-[2rem] border-4 border-[#F5E6D3] group shadow-lg">
                 
                 <Image
                  src={service.imageUrl || "/assets/imgs/imgService/service1.png"}
                  alt={service.name}
                  width={800}
                  height={600}
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                
                {service.price && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border-2 border-[#FF6B6B]">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Chi phí dự kiến</p>
                    <p className="text-2xl font-extrabold text-[#FF6B6B]">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                    </p>
                  </div>
                )}
              </div>

              
              <div className="grid grid-cols-2 gap-4">
                 <div className="rounded-2xl overflow-hidden h-32 border-2 border-[#F5E6D3]">
                    <Image src="/assets/imgs/imgPet/cat-2603300_1280.jpg" alt="Decor 1" width={300} height={200} className="w-full h-full object-cover"/>
                 </div>
                 <div className="rounded-2xl overflow-hidden h-32 border-2 border-[#F5E6D3]">
                    <Image src="/assets/imgs/imgPet/dog-4988985_1280.jpg" alt="Decor 2" width={300} height={200} className="w-full h-full object-cover"/>
                 </div>
              </div>
            </div>

            
            <div className="flex flex-col justify-center">
              
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-[#FFF0F5] px-4 py-1 rounded-full mb-4">
                   <Sparkles size={16} className="text-[#FF6B6B] animate-spin-slow" />
                   <span className="text-[#FF6B6B] font-bold text-sm uppercase">Dịch vụ cao cấp</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#5A3E2B] mb-4 leading-tight">
                  {service.name}
                </h1>
                <div className="h-1.5 w-24 bg-[#FF6B6B] rounded-full"></div>
              </div>

              <div className="prose prose-lg text-gray-600 mb-8 leading-relaxed">
                <p>{service.description}</p>
                <p className="mt-4 text-sm italic text-gray-500">
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
                 className="flex-1 bg-[#FF6B6B] hover:bg-[#ff5252] text-white py-4 px-6 rounded-2xl font-bold shadow-lg shadow-red-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                    <Calendar size={20} />
                    Đặt Lịch Ngay
                 </button>
                 <button className="flex-1 bg-white hover:bg-gray-50 text-[#5A3E2B] border-2 border-[#F5E6D3] py-4 px-6 rounded-2xl font-bold transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
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
  
  const serviceFeatures = [
    "Tư vấn chăm sóc thú cưng chuyên nghiệp từ đội ngũ bác sĩ thú y giàu kinh nghiệm.",
    "Sử dụng thiết bị và dụng cụ y tế hiện đại, đảm bảo an toàn tuyệt đối.",
    "Quy trình khám và điều trị theo tiêu chuẩn quốc tế, minh bạch và rõ ràng.",
    "Môi trường thân thiện, sạch sẽ giúp thú cưng cảm thấy thoải mái và không căng thẳng.",
    "Dịch vụ chăm sóc tận tâm, chu đáo từ lúc tiếp nhận đến khi hoàn thành.",
    "Hỗ trợ tư vấn dinh dưỡng và chế độ chăm sóc phù hợp cho từng loại thú cưng.",
    "Theo dõi sức khỏe định kỳ và nhắc nhở lịch hẹn tiêm phòng, khám bệnh.",
    "Cung cấp dịch vụ cấp cứu 24/7 trong các trường hợp khẩn cấp và nghiêm trọng.",
    "Giá cả hợp lý, minh bạch với nhiều gói dịch vụ phù hợp với mọi gia đình.",
    "Cam kết chất lượng dịch vụ cao và sự hài lòng của khách hàng là ưu tiên hàng đầu.",
  ];

  return (
    <main className="min-h-screen bg-white">
      
      <div className="mx-auto py-6" style={{ maxWidth: 'calc(100vw - 264px)', paddingLeft: '132px', paddingRight: '132px' }}>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Trở về dịch vụ
        </Link>
      </div>

      
      <div className="mx-auto mb-12" style={{ maxWidth: 'calc(100vw - 280px)', paddingLeft: '140px', paddingRight: '140px' }}>
        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src={service.imageUrl}
            alt={service.title}
            width={1200}
            height={600}
            className="h-[500px] w-full object-cover"
          />
          
          <div className="absolute left-6 bottom-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
            <span className="text-lg font-bold text-gray-800">
              {service.price}
            </span>
          </div>
        </div>
      </div>

      
      <div className="mx-auto" style={{ maxWidth: 'calc(100vw - 264px)', paddingLeft: '132px', paddingRight: '132px' }}>
        
        
        <h1 className="mb-8 text-4xl font-bold text-[#8B4513] md:text-5xl">
          Dịch vụ chăm sóc thú cưng chuyên nghiệp và tận tâm:
        </h1>

        
        <div className="mb-12 space-y-4 text-gray-600 leading-relaxed">
          <p>
            Tại trung tâm chăm sóc thú cưng của chúng tôi, chúng tôi hiểu rằng thú cưng không chỉ là động vật mà còn là thành viên quan trọng trong gia đình bạn. 
            Với đội ngũ bác sĩ thú y giàu kinh nghiệm và trang thiết bị hiện đại, chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe toàn diện và chất lượng cao nhất. 
            Từ khám sức khỏe định kỳ, điều trị bệnh, đến các dịch vụ làm đẹp và chăm sóc cá nhân, tất cả đều được thực hiện với sự tận tâm và chuyên nghiệp.
          </p>
          <p>
            Chúng tôi không ngừng cập nhật các phương pháp điều trị tiên tiến và duy trì môi trường làm việc sạch sẽ, an toàn để đảm bảo thú cưng của bạn 
            luôn cảm thấy thoải mái trong suốt quá trình chăm sóc. Sự hài lòng của khách hàng và sức khỏe của thú cưng chính là động lực để chúng tôi 
            không ngừng phát triển và hoàn thiện dịch vụ mỗi ngày.
          </p>
        </div>

        
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {serviceFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <Image
                  src="/assets/svg/chanmeo.svg"
                  alt="Paw icon"
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain"
                  style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(95%) saturate(7471%) hue-rotate(349deg) brightness(102%) contrast(101%)' }}
                />
              </div>
              <p className="text-sm text-gray-600">{feature}</p>
            </div>
          ))}
        </div>

        
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/assets/imgs/imgPet/dog-4988985_1280.jpg"
              alt="Dog and cats together"
              width={600}
              height={400}
              className="h-[300px] w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/assets/imgs/imgPet/cat-2603300_1280.jpg"
              alt="Pet feeding"
              width={600}
              height={400}
              className="h-[300px] w-full object-cover"
            />
          </div>
        </div>

      </div>
    </main>
  );
}
