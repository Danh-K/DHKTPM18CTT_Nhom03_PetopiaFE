
export interface BookingRequest {
  serviceId: string; 
  appointmentDate: string; 
  note?: string;
  quantity?: number; 
  priceAtPurchase?: number;

  
  email: string;
  name: string;
  phone: string;
}



export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
export interface Booking {
  bookingId: string;
  userId: string;
  serviceId: string;
  appointmentDate: string;
  note?: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
