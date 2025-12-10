"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useShopServices } from "@/hook/useSevices";
import { Loading } from "@/app/components/loading";



export default function ServiceSection() {
  
  const { data: services, isLoading, isError, error } = useShopServices();

  
  if (isLoading) return <Loading />;
  if (isError) {
    return (
      <div className="text-center py-16 text-red-500">
        Lỗi khi tải dịch vụ: {error.message}
      </div>
    );
  }

  return (
    <section className="py-16 px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl text-[#8B4513] mb-4 font-bold">DỊCH VỤ</h2>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {services?.map((service) => (
            <div
              key={service.serviceId}
              className="group bg-[#f5e6d3] rounded-3xl p-6 flex gap-4 transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-[#ff7b7b] before:rounded-3xl before:scale-0 before:transition-transform before:duration-500 before:ease-out hover:before:scale-100"
            >
              
              <div className="flex-shrink-0 relative z-10">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden">
                  <Image
                    src={service.imageUrl || "/assets/imgs/service-default.png"}
                    alt={service.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              
              <div className="flex flex-col justify-between relative z-10 w-full">
                <div>
                  <h3 className="text-xl font-bold text-[#1a3a52] group-hover:text-white mb-2 transition-colors duration-300">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 group-hover:text-white text-sm transition-colors duration-300 line-clamp-3">
                    {service.description}
                  </p>
                </div>
                
                
                <Link 
                  href={`/services/${service.serviceId}`} 
                  className="text-[#ff7b7b] group-hover:text-white font-semibold text-sm underline mt-4 transition-colors duration-300 cursor-pointer inline-block"
                >
                  TÌM HIỂU THÊM
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}