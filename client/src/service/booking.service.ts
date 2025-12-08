import axiosInstance from "@/lib/utils/axios";
import { Booking, BookingRequest } from "@/types/booking";
import { PageResponse } from "@/types/Review";

export const BookingService = {
  
  create: async (data: BookingRequest): Promise<Booking> => {
    const response = await axiosInstance.post("/bookings", data);
    return response.data.data; 
  },

  
  getMyBookings: async (page = 0, size = 10): Promise<PageResponse<Booking>> => {
    const response = await axiosInstance.get(`/bookings/me`, {
      params: { page, size }
    });
    return response.data.data;
  },

  


  
  
};