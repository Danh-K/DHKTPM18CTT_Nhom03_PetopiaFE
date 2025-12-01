"use client";

import React, { forwardRef, useMemo } from "react";
import Image from "next/image";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react"; 

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formatBookingDate } from "@/lib/validations/formatDate";
import { useCreateBooking } from "@/hook/useBookings";
import { useShopServices } from "@/hook/useSevices";
import { Loading } from "@/app/components/loading";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hook/useToast";


const bookingServiceSchema = z.object({
  serviceId: z.string().min(1, "Vui lòng chọn dịch vụ"),
  quantity: z.number().min(1, "Số lượng tối thiểu là 1"),
  price: z.number(), 
});

const bookingSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().regex(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  bookingDate: z.string().min(1, "Vui lòng chọn ngày hẹn"),
  note: z.string().optional(),
  
  selectedServices: z.array(bookingServiceSchema).min(1, "Chọn ít nhất 1 dịch vụ"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookingSection = forwardRef<HTMLElement>((props, ref) => {
  const createBookingMutation = useCreateBooking();
  const { user } = useAuthStore();
  const { success, error: showError, ToastContainer } = useToast();
  
  
  const { data: services, isLoading, isError, error } = useShopServices();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      note: "",
      bookingDate: "",
      
      selectedServices: [{ serviceId: "", quantity: 1, price: 0 }],
    },
  });

  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "selectedServices",
  });

  
  const watchedServices = watch("selectedServices");
  const totalPrice = useMemo(() => {
    return watchedServices.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 1);
    }, 0);
  }, [watchedServices]);

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center py-10 text-red-500">Lỗi: {error.message}</div>;

  const onSubmit = (data: BookingFormData) => {
    if (!user?.userId) {
      showError("Yêu cầu đăng nhập", "Vui lòng đăng nhập để đặt lịch.");
      return;
    }

    const formattedDate = formatBookingDate(data.bookingDate);

    
    
    
    
    
    const firstItem = data.selectedServices[0];
    const calculatedPrice = firstItem.price * firstItem.quantity;

    createBookingMutation.mutate({
      serviceId: firstItem.serviceId,
      appointmentDate: formattedDate,
      note: data.note,
      quantity: firstItem.quantity,
      priceAtPurchase: calculatedPrice, 
    }, {
      onSuccess: () => {
        success("Thành công", `Đã đặt dịch vụ! Tổng tạm tính: ${totalPrice.toLocaleString()}đ`);
        reset();
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || "Có lỗi xảy ra khi đặt lịch.";
        showError("Lỗi", msg);
      }
    });
  };

  return (
    <section ref={ref} className="relative py-16 px-4 bg-gradient-to-br from-[#f8f4f0] to-[#ede7e0] flex flex-col items-center justify-center">
      <ToastContainer />
      
      
      <Image src="/assets/iconAnimate/dog.gif" alt="Dog Icon" width={300} height={300} className="absolute top-10 left-5 md:left-12 z-0" />
      <Image src="/assets/icon/dog4.png" alt="Dog Icon" width={200} height={200} className="absolute top-4 right-0 md:right-12 z-0" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#7B4F35]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[#C46C2B]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl text-[#8B4513] mb-4 tracking-wide font-bold">Đặt Lịch Ngay</h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Chúng tôi cung cấp các dịch vụ chăm sóc thú cưng chất lượng cao...
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <h2 className="text-4xl text-[#8B4513] mb-4 font-semibold">Đặt Lịch</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto border border-gray-100">
          
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <Input {...register("name")} placeholder="Họ tên" className="h-14 px-4 bg-gray-50 rounded-xl" />
              {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
            </div>
            <div>
              <Input {...register("phone")} placeholder="Số điện thoại" className="h-14 px-4 bg-gray-50 rounded-xl" />
              {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
            </div>
            <div>
              <Input {...register("email")} placeholder="Email" type="email" className="h-14 px-4 bg-gray-50 rounded-xl" />
              {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
            </div>
          </div>

          
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#8B4513]">Dịch vụ</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => append({ serviceId: "", quantity: 1, price: 0 })}
                  className="text-[#8B4513] border-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                >
                  <Plus size={16} className="mr-1"/> Thêm dịch vụ
                </Button>
             </div>

             <div className="space-y-3">
               {fields.map((field, index) => (
                 <div key={field.id} className="flex gap-3 items-start">
                    
                    <div className="flex-1">
                      <Controller
                        control={control}
                        name={`selectedServices.${index}.serviceId`}
                        render={({ field }) => (
                          <Select 
                            onValueChange={(val) => {
                                field.onChange(val);
                                
                                const selectedService = services?.find(s => String(s.serviceId) === val);
                                if (selectedService) {
                                    setValue(`selectedServices.${index}.price`, selectedService.price || 0);
                                }
                            }} 
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="h-14 bg-white rounded-xl">
                              <SelectValue placeholder="Chọn dịch vụ" />
                            </SelectTrigger>
                            <SelectContent>
                              {services?.map((s) => (
                                <SelectItem key={s.serviceId} value={String(s.serviceId)}>
                                  {s.name} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s.price || 0)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.selectedServices?.[index]?.serviceId && (
                          <span className="text-red-500 text-xs">Vui lòng chọn</span>
                      )}
                    </div>

                    
                    <div className="w-24">
                        <Input 
                            type="number" 
                            min={1}
                            placeholder="SL"
                            {...register(`selectedServices.${index}.quantity`, { valueAsNumber: true })}
                            className="h-14 bg-white text-center rounded-xl"
                        />
                    </div>

                    
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 text-red-500 hover:bg-red-50 rounded-xl"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1} 
                    >
                        <Trash2 size={20} />
                    </Button>
                 </div>
               ))}
             </div>
             
             
             <div className="mt-4 text-right border-t border-gray-200 pt-3">
                <span className="text-gray-600 mr-2">Tạm tính:</span>
                <span className="text-xl font-bold text-[#8B4513]">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                </span>
             </div>
          </div>
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Ngày giờ hẹn</label>
              <Input
                {...register("bookingDate")}
                type="datetime-local"
                className="h-14 px-4 bg-gray-50 rounded-xl"
              />
               {errors.bookingDate && <span className="text-red-500 text-xs mt-1">{errors.bookingDate.message}</span>}
            </div>
            
            <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-600 mb-2 block">Ghi chú thêm</label>
                <textarea
                {...register("note")}
                placeholder="Ví dụ: Thú cưng của tôi hơi nhát với người lạ..."
                className="w-full min-h-[100px] px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#7B4F35] focus:border-transparent resize-none outline-none text-gray-700"
                />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={createBookingMutation.isPending}
            className="w-full h-14 bg-[#7B4F35] text-white font-bold text-lg rounded-xl hover:bg-[#5e3924] shadow-lg hover:translate-y-[-2px] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {createBookingMutation.isPending ? (
              <div className="flex items-center gap-2">
                <Loading /> 
                <span>Đang gửi yêu cầu...</span>
              </div>
            ) : (
              "XÁC NHẬN ĐẶT LỊCH"
            )}
          </Button>
        </form>
      </div>
    </section>
  )
});

BookingSection.displayName = "BookingSection";
export default BookingSection;