import { Service } from "@/types/Service";
import axios from "axios";

export const ShopServiceAPI = { 
  getAll: async (): Promise<Service[]> => {
    const response = await axios.get("/services");
    return response.data;
  },
};