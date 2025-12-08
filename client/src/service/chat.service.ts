

import axiosInstance from "@/lib/utils/axios";
import { AiResponse } from "@/types/Chat";

export const ChatService = {
  
  sendMessage: async (message: string): Promise<AiResponse> => {
    
    
    const response = await axiosInstance.post("/chat", { message });
    console.log(response.data)
    
    return response.data.data;
  },
};