import axiosInstance from "@/lib/utils/axios";
import { WishlistResponse } from "@/types/Pet";

export const WishlistService = {
 
  getMyWishlist: async (page = 0, size = 100): Promise<WishlistResponse[]> => {
    const response = await axiosInstance.get(`/wishlists/me`, {
      params: { page, size }
    });
   
   
    const resData = response.data.data;
    return Array.isArray(resData) ? resData : resData.content || [];
  },

 
  toggleWishlist: async (petId: string): Promise<string> => {
    const response = await axiosInstance.post(`/wishlists/toggle/${petId}`);
    return response.data.data; 
  }
};