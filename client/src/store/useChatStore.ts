import { create } from 'zustand';
import { ChatMessage } from '@/types/Chat';

interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  
  recommendations: any[]; 
  
  toggleChat: () => void;
  setOpen: (open: boolean) => void;
  addMessage: (msg: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
  
  setRecommendations: (data: any[]) => void;
  clearRecommendations: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  messages: [
    {
      id: 'welcome',
      sender: 'bot',
      content: 'Chào Sen! 🐾 Em là trợ lý ảo Petopia. Sen cần tìm "boss" cưng hay dịch vụ gì thì bảo em nhé! 🥰',
      timestamp: Date.now(),
      actionType: 'NONE'
    }
  ],
  isTyping: false,
  
  recommendations: [],

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
  
  addMessage: (msg) => set((state) => ({ 
    messages: [...state.messages, msg] 
  })),
  
  setTyping: (typing) => set({ isTyping: typing }),
  clearMessages: () => set({ messages: [] }),

  setRecommendations: (data) => set({ recommendations: data }),
  clearRecommendations: () => set({ recommendations: [] })
}));