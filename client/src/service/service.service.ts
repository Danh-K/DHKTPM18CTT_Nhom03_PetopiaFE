import axiosInstance from "@/lib/utils/axios";
import { Service } from "@/types/Service";

export const ShopServiceAPI = { 
  getAll: async (): Promise<Service[]> => {
    const response = await axiosInstance.get("/services");
    console.log("Fetched services:", response.data.content);
    return response.data.content;
  },
  getById: async (id: string): Promise<Service> => {
    const response = await axiosInstance.get(`/services/${id}`);
    return response.data;
  },
};