import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookingRequest } from "@/types/booking";
import { BookingService } from "@/service/booking.service";


export const BOOKING_KEYS = {
  MY_BOOKINGS: "my-bookings",
  BOOKING_SERVICES: "booking-services",
  ALL_BOOKINGS: "all-bookings", 
};


export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookingRequest) => BookingService.create(data),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: [BOOKING_KEYS.MY_BOOKINGS] });
    },
  });
};


export const useMyBookings = (page: number, size: number) => {
  return useQuery({
    queryKey: [BOOKING_KEYS.MY_BOOKINGS, page, size],
    queryFn: () => BookingService.getMyBookings(page, size),
    
    placeholderData: (previousData) => previousData, 
  });
};


