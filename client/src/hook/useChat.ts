// src/hooks/useChat.ts

import { useMutation } from "@tanstack/react-query";
import { ChatService } from "@/service/chat.service";
import { AiResponse } from "@/types/Chat";

interface UseChatOptions {
  onSuccess?: (data: AiResponse) => void;
  onError?: (error: any) => void;
}

export const useChatAI = (options?: UseChatOptions) => {
  return useMutation({
    mutationFn: (message: string) => ChatService.sendMessage(message),
    
    onSuccess: (data) => {
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    
    onError: (error: any) => {
      console.error("Lỗi Chat AI:", error);
      if (options?.onError) {
        options.onError(error);
      }
    }
  });
};