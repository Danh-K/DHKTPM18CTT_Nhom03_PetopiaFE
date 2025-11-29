"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart, PawPrint, Shield } from "lucide-react";

export default function AboutPage() {
  // const { data: services } = trpc.service.getAll.useQuery(); // Sử dụng khi có API
  
  // Gallery state và refs
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [userInteracting, setUserInteracting] = useState(false);
  
  // Danh sách ảnh từ thư mục imgAbout
  const galleryImages = [
    { src: "/assets/imgs/imgAbout/1.jpg", alt: "Pet care image 1" },
    { src: "/assets/imgs/imgAbout/2.jpg", alt: "Pet care image 2" },
    { src: "/assets/imgs/imgAbout/3.jpg", alt: "Pet care image 3" },
    { src: "/assets/imgs/imgAbout/4.jpg", alt: "Pet care image 4" },
    { src: "/assets/imgs/imgAbout/5.jpg", alt: "Pet care image 5" },
    { src: "/assets/imgs/imgAbout/6.jpg", alt: "Pet care image 6" },
    { src: "/assets/imgs/imgAbout/7.jpg", alt: "Pet care image 7" },
    { src: "/assets/imgs/imgAbout/8.jpg", alt: "Pet care image 8" },
  ];
  
  // Tạo vòng lặp vô tận bằng cách nhân đôi mảng
  const infiniteImages = [...galleryImages, ...galleryImages, ...galleryImages];
  
  // Tự động chuyển ảnh chỉ khi không có tương tác
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging && !userInteracting && galleryRef.current) {
        const container = galleryRef.current;
        const imageWidth = 208; // 192px (w-48) + 16px (gap-4)
        container.scrollLeft += imageWidth;
      }
    }, 3000); // Chuyển ảnh mỗi 3 giây
    
    return () => clearInterval(interval);
  }, [isDragging, userInteracting]);
  
  // Xử lý kéo chuột với hiệu ứng mượt mà hơn
  const handleMouseDown = (e: React.MouseEvent) => {
    if (galleryRef.current) {
      setIsDragging(true);
      setUserInteracting(true);
      setStartX(e.pageX - galleryRef.current.offsetLeft);
      setScrollLeft(galleryRef.current.scrollLeft);
      galleryRef.current.style.cursor = 'grabbing';
      galleryRef.current.style.scrollBehavior = 'auto'; // Tắt smooth scroll khi kéo
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !galleryRef.current) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX) * 1.2; // Tốc độ kéo tối ưu
    
    // Sử dụng requestAnimationFrame để smooth hơn
    requestAnimationFrame(() => {
      if (galleryRef.current) {
        galleryRef.current.scrollLeft = scrollLeft - walk;
      }
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    if (galleryRef.current) {
      galleryRef.current.style.cursor = 'grab';
      galleryRef.current.style.scrollBehavior = 'smooth'; // Bật lại smooth scroll
    }
    // Đặt timeout để user có thể tiếp tục kéo mà không bị auto scroll ngay
    setTimeout(() => setUserInteracting(false), 5000); // Tăng lên 5 giây
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
    if (galleryRef.current) {
      galleryRef.current.style.cursor = 'grab';
      galleryRef.current.style.scrollBehavior = 'smooth';
    }
    // Đặt timeout để user có thể tiếp tục kéo mà không bị auto scroll ngay
    setTimeout(() => setUserInteracting(false), 5000); // Tăng lên 5 giây
  };

  // Touch events cho mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (galleryRef.current) {
      setIsDragging(true);
      setUserInteracting(true);
      setStartX(e.touches[0].pageX - galleryRef.current.offsetLeft);
      setScrollLeft(galleryRef.current.scrollLeft);
      galleryRef.current.style.scrollBehavior = 'auto';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !galleryRef.current) return;
    const x = e.touches[0].pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    
    // Sử dụng requestAnimationFrame để smooth hơn
    requestAnimationFrame(() => {
      if (galleryRef.current) {
        galleryRef.current.scrollLeft = scrollLeft - walk;
      }
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (galleryRef.current) {
      galleryRef.current.style.scrollBehavior = 'smooth';
    }
    // Đặt timeout để user có thể tiếp tục kéo mà không bị auto scroll ngay
    setTimeout(() => setUserInteracting(false), 5000); // Tăng lên 5 giây
  };
  
  // Xử lý vòng lặp vô tận mượt mà - chỉ khi auto scroll, không khi user tương tác
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (!galleryRef.current) return;
      
      // Chỉ xử lý vòng lặp khi không có tương tác từ user
      if (isDragging || userInteracting) return;
      
      const container = galleryRef.current;
      const imageWidth = 216; // 192px width + 24px gap
      const totalOriginalWidth = imageWidth * galleryImages.length;
      
      // Debounce để tránh gọi quá nhiều lần
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!container || isDragging || userInteracting) return;
        
        // Nếu scroll gần về đầu
        if (container.scrollLeft <= imageWidth / 2) {
          container.style.scrollBehavior = 'auto';
          container.scrollLeft = totalOriginalWidth + container.scrollLeft;
          setTimeout(() => {
            if (container) container.style.scrollBehavior = 'smooth';
          }, 50);
        }
        // Nếu scroll gần đến cuối
        else if (container.scrollLeft >= totalOriginalWidth * 2 - imageWidth / 2) {
          container.style.scrollBehavior = 'auto';
          container.scrollLeft = container.scrollLeft - totalOriginalWidth;
          setTimeout(() => {
            if (container) container.style.scrollBehavior = 'smooth';
          }, 50);
        }
      }, 100);
    };
    
    const container = galleryRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      // Set vị trí ban đầu ở giữa (set thứ 2)
      setTimeout(() => {
        if (container && !userInteracting) {
          container.style.scrollBehavior = 'auto';
          container.scrollLeft = 208 * galleryImages.length;
          container.style.scrollBehavior = 'smooth';
        }
      }, 200);
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
        clearTimeout(timeoutId);
      };
    }
  }, [galleryImages.length, isDragging, userInteracting]);


  return (
    <div className="min-h-screen">
      {/* Title Section with Background */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/assets/imgs/imgBackgroundTitle/bc-store-loc.jpg"
            alt="About Background"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 
            className="text-center font-bold text-6xl text-white drop-shadow-lg"
          >
            Về Chúng Tôi
          </h1>
        </div>
      </div>
 
      <div className="about-container mx-auto py-8 px-10 space-y-12">
        {/* Our Story Section */}
        <section className="relative py-16 px-4 md:px-8 lg:px-16 overflow-hidden ">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 right-10 w-32 h-32 "></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 "></div>
            {/* Diagonal stripes pattern */}
            <div className="absolute top-0 right-0 w-96 h-96 opacity-20">
              <div className="w-full h-full transform rotate-45 translate-x-32 -translate-y-32"></div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Images */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-6">
                  {/* Woman with dogs image */}
                  <div className="relative ">
                    <div className=" p-6 relative ">
                      <Image
                        src="/assets/imgs/imgAbout/imgTrai.jpg"
                        alt="Happy woman holding two French Bulldogs"
                        width={300}
                        height={600}
                        className="rounded-2xl object-cover w-full h-[28rem]"
                      />
                    </div>
                  </div>

                  {/* Cat image */}
                  <div className="relative mt-8">
                    <div className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-3xl overflow-hidden">
                      <Image
                        src="/assets/imgs/imgAbout/imgPhai.jpg"
                        alt="Hands holding an orange tabby cat"
                        width={280}
                        height={500}
                        className="object-cover w-full h-96"
                      />
                    </div>
                  </div>
                </div>

                {/* Pet Friendly Badge - positioned between the two images */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="relative w-24 h-24 bg-white rounded-full">
                    {/* Rotate background */}
                    <div className="absolute inset-0">
                      <Image
                        src="/assets/imgs/imgAbout/rotate.svg"
                        alt="Rotate background"
                        width={96}
                        height={96}
                        className="w-full h-full animate-spin-slow"
                      />
                    </div>
                    {/* Foots icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src="/assets/imgs/imgAbout/foots.png"
                        alt="Pet footprints"
                        width={40}
                        height={40}
                        className="w-10 h-10"
                      />
                    </div>
                   
                  </div>
                </div>
              </div>

              {/* Right side - Content */}
              <div className="space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <p className="text-amber-600 font-semibold text-sm tracking-wider uppercase">CÂU CHUYỆN CỦA CHÚNG TÔI</p>
                  <h2 className="text-4xl lg:text-5xl font-bold text-amber-900 leading-tight">
                    Chăm Sóc Thú Cưng Với Đam Mê: Câu Chuyện, Sứ Mệnh & Giá Trị Của Chúng Tôi
                  </h2>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-lg leading-relaxed">
                  Chúng tôi tự hào mang đến dịch vụ chăm sóc thú cưng chất lượng cao với tình yêu thương và sự tận tâm.
                  Mỗi thú cưng đều được chăm sóc như một thành viên trong gia đình của chúng tôi.
                </p>

                {/* Feature list */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-3 flex-shrink-0">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900 text-lg">
                        Người bạn đồng hành cao cấp cho những người yêu thú cưng khó tính
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full p-3 flex-shrink-0">
                      <PawPrint className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900 text-lg">Thú Cưng Cao Cấp Được Chăm Sóc Với Tình Yêu Thương</h3>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full p-3 flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900 text-lg">Hạnh Phúc Bắt Đầu Từ Việc Chăm Sóc Thú Cưng Đúng Cách</h3>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:-translate-y-1">
                    Đọc Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section - Redesigned */}
        <section className="py-16 px-4  relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Statistics Badges */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 flex-1">
                {/* Stat 1 - Jagged star shape - Color #f2be8f */}
                <div className="relative flex justify-center group">
                  <div
                    className="relative w-36 h-28 lg:w-44 lg:h-32 flex items-center justify-center transition-all duration-500 animate-bounce hover:scale-110"
                    style={{
                      backgroundColor: "#f2be8f",
                      border: "2px solid #e5a870",
                      clipPath: "polygon(0% 20%, 20% 0%, 80% 0%, 100% 20%, 95% 40%, 100% 60%, 80% 100%, 20% 100%, 0% 80%, 5% 60%, 0% 40%)",
                      animationDelay: "0s"
                    }}
                  >
                    <div className="text-center px-2">
                      <div className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1">360+</div>
                      <div className="text-xs lg:text-sm font-semibold text-slate-600 tracking-wide leading-tight">
                        THÚ CƯNG<br/>ĐÃ CHỮA
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stat 2 - Scalloped oval - Color #ffb4a2 */}
                <div className="relative flex justify-center group">
                  <div
                    className="relative w-36 h-28 lg:w-44 lg:h-32 flex items-center justify-center transition-all duration-500 animate-bounce hover:scale-110"
                    style={{
                      backgroundColor: "#ffb4a2",
                      border: "2px solid #ff9e8a",
                      clipPath: "polygon(10% 0%, 90% 0%, 100% 15%, 95% 35%, 100% 55%, 90% 70%, 100% 85%, 90% 100%, 10% 100%, 0% 85%, 10% 70%, 0% 55%, 5% 35%, 0% 15%)",
                      animationDelay: "0.3s"
                    }}
                  >
                    <div className="text-center px-2">
                      <div className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1">35+</div>
                      <div className="text-xs lg:text-sm font-semibold text-slate-600 tracking-wide leading-tight">
                        THÀNH VIÊN<br/>ĐỘI NGŨ
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stat 3 - Wavy oval - Color #f2be8f */}
                <div className="relative flex justify-center group">
                  <div
                    className="relative w-36 h-28 lg:w-44 lg:h-32 flex items-center justify-center transition-all duration-500 animate-bounce hover:scale-110"
                    style={{
                      backgroundColor: "#f2be8f",
                      border: "2px solid #e5a870",
                      clipPath: "polygon(15% 0%, 85% 0%, 100% 25%, 90% 50%, 100% 75%, 85% 100%, 15% 100%, 0% 75%, 10% 50%, 0% 25%)",
                      animationDelay: "0.6s"
                    }}
                  >
                    <div className="text-center px-2">
                      <div className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1">10K+</div>
                      <div className="text-xs lg:text-sm font-semibold text-slate-600 tracking-wide leading-tight">
                        KHÁCH HÀNG<br/>HÀI LÒNG
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stat 4 - Complex jagged - Color #ffb4a2 */}
                <div className="relative flex justify-center group">
                  <div
                    className="relative w-36 h-28 lg:w-44 lg:h-32 flex items-center justify-center transition-all duration-500 animate-bounce hover:scale-110"
                    style={{
                      backgroundColor: "#ffb4a2",
                      border: "2px solid #ff9e8a",
                      clipPath: "polygon(0% 15%, 15% 0%, 85% 0%, 100% 15%, 95% 30%, 100% 45%, 85% 60%, 100% 75%, 85% 100%, 15% 100%, 0% 85%, 5% 70%, 0% 55%, 15% 40%, 0% 30%)",
                      animationDelay: "0.9s"
                    }}
                  >
                    <div className="text-center px-2">
                      <div className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1">99+</div>
                      <div className="text-xs lg:text-sm font-semibold text-slate-600 tracking-wide leading-tight">
                        SẢN PHẨM<br/>THÚ CƯNG
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Background Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-200/30 rounded-full blur-xl animate-pulse delay-300"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-200/30 rounded-full blur-lg animate-pulse delay-500"></div>
            <div className="absolute top-1/4 right-1/3 w-24 h-24 bg-amber-200/20 rounded-full blur-xl animate-pulse delay-700"></div>
          </div>
          

        </section>
  {/* Dog Image - Positioned at the right side inside container */}
  <div className="absolute -right-4 lg:-right-4 top-[950px] -translate-y-1/2 w-48 h-48 lg:w-64 lg:h-64 z-10">
          <Image
            src="/assets/imgs/imgAbout/anhChoRight.png"
            alt="Happy dog coming out"
            fill
            className="object-contain object-right"
          />
        </div>
       {/* Photo Gallery Section - Smooth draggable gallery */}
       <section className="py-8">
         <div className="container mx-auto px-4 flex justify-center">
           {/* Gallery Container */}
           <div 
             ref={galleryRef}
             className="gallery-container flex gap-4 overflow-x-auto pb-4"
             style={{
               width: 'calc(6 * 192px + 5 * 16px + 32px)', // Chính xác 6 ảnh: 6 * 192px (width) + 5 * 16px (gaps) + 32px (padding)
               maxWidth: '100vw',
               paddingLeft: '16px',
               paddingRight: '16px',
               cursor: isDragging ? 'grabbing' : 'grab',
               scrollbarWidth: 'none',
               msOverflowStyle: 'none',
               WebkitOverflowScrolling: 'touch'
             }}
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseLeave}
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}
           >
             {infiniteImages.map((image, index) => (
               <div
                 key={`${image.src}-${index}`}
                 className="gallery-image flex-shrink-0 w-48 h-36 rounded-2xl overflow-hidden "
                 style={{
                   transition: 'transform 0.4s ',
                   willChange: 'transform',
                   backfaceVisibility: 'hidden',
                   WebkitBackfaceVisibility: 'hidden'
                 }}
               >
                 <Image
                   src={image.src}
                   alt={image.alt}
                   width={192}
                   height={144}
                   className="w-full h-full object-cover"
                   draggable={false}
                   priority={index < 6}
                 />
               </div>
             ))}
           </div>
       </div>
       </section>
      </div>
    </div>
  );
}