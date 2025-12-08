import axiosInstance from "@/lib/utils/axios";
import { Service } from "@/types/Service";

export const ShopServiceAPI = { 
  getAll: async (): Promise<Service[]> => {
    const response = await axiosInstance.get("/services");
    return response.data.content;
  },
  getById: async (id: string): Promise<Service> => {
    const response = await axiosInstance.get(`/services/${id}`);
    return response.data;
  },
};