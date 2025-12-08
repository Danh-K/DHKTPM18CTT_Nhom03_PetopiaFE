"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

//
import { useToast } from "@/hook/useToast";
import { useSendContact } from "@/hook/useContact";


const contactSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
  address: z.string().optional(), 
  email: z.string().email("Email không hợp lệ"),
  subject: z.string().min(1, "Vui lòng nhập chủ đề"),
  message: z.string().min(10, "Nội dung cần ít nhất 10 ký tự"), 
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  
  const { success, error: showError, ToastContainer } = useToast();
  const { mutate: sendContact, isPending } = useSendContact();

  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  
  const onSubmit = (data: ContactFormData) => {
    sendContact(data, {
      onSuccess: () => {
        success("Gửi thành công", "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!");
        reset(); 
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Gửi liên hệ thất bại. Vui lòng thử lại.";
        showError("Lỗi", msg);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      <ToastContainer />

      
      <div className="relative py-24">
        <div className="absolute inset-0">
          <img 
            src="/assets/imgs/imgBackgroundTitle/bc-conatct.jpg"
            alt="Contact Background"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-center font-bold text-6xl text-white drop-shadow-lg">
            Liên Hệ
          </h1>
        </div>
      </div>

      <div className="bg-white" style={{ height: '100px' }}></div>

      <div className="flex relative">
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-3/4 -translate-y-1/2 text-white p-6 rounded-lg shadow-lg max-w-xs z-20" style={{ marginLeft: '-25px', backgroundColor: '#1fa8be' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-lg" style={{ color: '#1fa8be' }}>📍</span>
            </div>
            <h3 className="text-xl font-bold">Vị Trí</h3>
          </div>
          <p className="text-sm italic mb-3">đến đây để gặp chúng tôi !</p>
          <div className="space-y-1 text-sm">
            <p>00 Quang Trung, phường 11</p>
            <p>Gò Vấp, TP.HCM</p>
            <p>Việt Nam</p>
          </div>
        </div>

        
        <div className="w-1/2 relative min-h-screen hidden lg:block">
           
           <iframe
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.858169091077!2d106.68427047481882!3d10.822164158349184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e54969507f%3A0xea73b2e1d95100ba!2zQ8O0bmcgdHkgQ-G7lSBwaOG6p24gUGhần mềm FPT!5e0!3m2!1svi!2s!4v1710000000000!5m2!1svi!2s"
             width="100%"
             height="100%"
             style={{ border: 0 }}
             allowFullScreen
             loading="lazy"
             referrerPolicy="no-referrer-when-downgrade"
             className="absolute inset-0"
           />
           
            
        </div>

        
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 relative min-h-screen">
          
          <div className="absolute inset-0">
            <Image
              src="/assets/imgs/imgContact/contact_bg.jpg"
              alt="Contact Background"
              fill
              className="object-cover"
            />
          </div>

          <div className="max-w-md relative z-10 mx-auto w-full">
            <h1 className="text-4xl font-bold text-[#7B4F35] mb-2">Liên Hệ Với Chúng Tôi!</h1>
            <p className="text-[#A0694B] italic mb-2">Hãy liên lạc với chúng tôi !</p>
            <p className="text-sm text-[#8B5A3C] mb-8">
              Nhập thông tin của bạn vào đây để gửi yêu cầu trực tiếp đến địa chỉ email của chúng tôi.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <Input
                        {...register("name")}
                        placeholder="Họ tên*"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7B4F35]/20 focus:border-[#7B4F35] shadow-none"
                    />
                    {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
                </div>
                
                <div>
                    <Input
                        {...register("phone")}
                        placeholder="Điện thoại*"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7B4F35]/20 focus:border-[#7B4F35] shadow-none"
                    />
                    {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <Input
                        {...register("address")}
                        placeholder="Địa chỉ"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7B4F35]/20 focus:border-[#7B4F35] shadow-none"
                    />
                </div>
                <div>
                    <Input
                        {...register("email")}
                        placeholder="Email*"
                        type="email"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7B4F35]/20 focus:border-[#7B4F35] shadow-none"
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                </div>
              </div>

              <div>
                <Input
                    {...register("subject")}
                    placeholder="Chủ đề*"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7B4F35]/20 focus:border-[#7B4F35] shadow-none"
                />
                {errors.subject && <span className="text-red-500 text-xs mt-1 block">{errors.subject.message}</span>}
              </div>

              <div>
                <textarea
                    {...register("message")}
                    placeholder="Nội dung*"
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7B4F35]/20 focus:border-[#7B4F35] shadow-none resize-none"
                />
                {errors.message && <span className="text-red-500 text-xs mt-1 block">{errors.message.message}</span>}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#7B4F35] hover:bg-[#A0694B] text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 disabled:opacity-70"
              >
                {isPending ? (
                   <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang gửi...</>
                ) : (
                   "Gửi Tin Nhắn"
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-[#8B5A3C] mb-1">
                <span className="font-semibold">Điện thoại :</span> <span className="font-semibold" style={{ color: '#2d8aa3' }}>0786012569</span>
              </p>
              <p className="text-[#8B5A3C]">
                <span className="font-semibold">Email :</span>{" "}
                <a href="mailto:duchaunguyen131@gmail.com" className="hover:underline font-semibold" style={{ color: '#2d8aa3', textUnderlineOffset: '3px' }}>
                  duchaunguyen131@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}