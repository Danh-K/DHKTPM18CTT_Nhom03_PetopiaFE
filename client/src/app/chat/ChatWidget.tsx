"use client";

import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import { Send, X, MessageCircle, Sparkles, Smile, ChevronRight } from "lucide-react";
import StickyPetList from "./StickyPetList"; 
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useChatAI } from "@/hook/useChat";

export default function ChatWidget() {
  const { isOpen, toggleChat, messages, addMessage, isTyping, setTyping, setRecommendations } = useChatStore();
  const { mutate: chatAI } = useChatAI();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  
  const quickQuestions = [
    "🐶 Tìm mua Corgi",
    "🛁 Giá dịch vụ Spa",
    "🚚 Kiểm tra đơn hàng",
    "💊 Tư vấn sức khỏe",
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    
    addMessage({
      id: Date.now().toString(),
      sender: "user",
      content: text,
      timestamp: Date.now(),
    });
    setInput("");
    setTyping(true);

    
    chatAI(text, {
      onSuccess: (res) => {
        setTyping(false);
        if (!res) {
            addMessage({
                id: Date.now().toString(),
                sender: "bot",
                content: "Hệ thống đang bảo trì một chút, bạn thử lại sau nhé! (Lỗi phản hồi rỗng)",
                actionType: "NONE",
                timestamp: Date.now(),
            });
            return;
        }
        
        if (res.actionType === "SHOW_PETS") {
          
          setRecommendations(res.data); 
        } 
        
        
        addMessage({
          id: Date.now().toString(),
          sender: "bot",
          content: res.message || "...", 
          actionType: res.actionType || "NONE", 
          data: res.data,
          timestamp: Date.now(),
        });
      },
      onError: () => {
        setTyping(false);
        addMessage({
          id: Date.now().toString(),
          sender: "bot",
          content: "Xin lỗi Sen ơi, em đang bị chóng mặt xíu. Sen hỏi lại sau nhé! 😵‍💫",
          timestamp: Date.now(),
        });
      }
    });
  };

  
  const handleLinkClick = (type: string, item: any) => {
      if (type === "SHOW_SERVICES") router.push(`/services/${item.serviceId}`);
      if (type === "SHOW_ARTICLES") router.push(`/news/${item.articleId}`);
      
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="group relative flex items-center justify-center w-16 h-16 bg-[#FF6B6B] rounded-full shadow-lg hover:scale-110 transition-transform duration-300 animate-bounce-slow"
        >
          
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF6B6B] opacity-75 animate-ping"></span>
          
          <div className="relative z-10 text-white">
             
             <MessageCircle size={32} fill="white" className="text-white" />
          </div>
          
          
          <div className="absolute right-full mr-4 bg-white text-[#5A3E2B] px-4 py-2 rounded-xl shadow-md text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
             Cần tư vấn hem? 🐾
          </div>
        </button>
      )}

      
      {isOpen && (
        <div className="w-[380px] h-[600px] bg-[#FDF5F0] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border-4 border-white animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          
          <div className="bg-[#FF6B6B] p-4 flex items-center justify-between text-white shadow-md relative z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full p-0.5 relative">
                 <Image src="/assets/svg/chatbot.png" alt="Bot" width={40} height={40} className="rounded-full object-cover w-full h-full" />
                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-lg leading-none">Petopia AI</h3>
                <span className="text-xs text-white/80 flex items-center gap-1">
                   <Sparkles size={10} /> Trợ lý ảo cute
                </span>
              </div>
            </div>
            <button onClick={toggleChat} className="hover:bg-white/20 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          
          <StickyPetList />

          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FDF5F0] scrollbar-thin scrollbar-thumb-[#FF6B6B]/20">
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                
                
                {msg.sender === "bot" && (
                   <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-1">
                      <Image src="/assets/svg/chatbot.png" width={32} height={32} alt="Bot" className="object-cover w-full h-full"/>
                   </div>
                )}

                <div className={`max-w-[80%] space-y-2`}>
                    
                    <div className={`p-3.5 text-sm rounded-2xl shadow-sm ${
                        msg.sender === "user" 
                        ? "bg-[#FF6B6B] text-white rounded-br-none" 
                        : "bg-white text-[#5A3E2B] rounded-bl-none border border-[#F5E6D3]"
                    }`}>
                        {msg.content}
                    </div>

                    
                    {msg.sender === 'bot' && msg.actionType !== 'NONE' && msg.actionType !== 'SHOW_PETS' && msg.data && Array.isArray(msg.data) && (
                        <div className="bg-white rounded-xl p-2 border border-[#F5E6D3] shadow-sm space-y-1">
                            {msg.data.map((item: any, idx: number) => (
                                <div 
                                    key={idx} 
                                    onClick={() => handleLinkClick(msg.actionType!, item)}
                                    className="flex items-center justify-between p-2 hover:bg-[#FFF5F5] rounded-lg cursor-pointer transition-colors group"
                                >
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-[#5A3E2B] group-hover:text-[#FF6B6B]">
                                            {item.name || item.title || item.code}
                                        </p>
                                        {item.price && (
                                            <p className="text-[10px] text-[#8B6E5B]">
                                                {new Intl.NumberFormat('vi-VN').format(item.price)}₫
                                            </p>
                                        )}
                                    </div>
                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-[#FF6B6B]" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                 <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-200 animate-pulse"></div>
                 <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-[#F5E6D3] flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full animate-bounce delay-150"></span>
                 </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          
          {messages.length < 2 && (
             <div className="px-4 pb-2 flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSend(q)}
                        className="text-xs bg-white text-[#8B6E5B] border border-[#E5D0C0] px-3 py-1.5 rounded-full hover:bg-[#FF6B6B] hover:text-white hover:border-[#FF6B6B] transition-all"
                    >
                        {q}
                    </button>
                ))}
             </div>
          )}

          
          <div className="p-3 bg-white border-t border-[#F5E6D3]">
            <div className="flex items-center gap-2 bg-[#F9F9F9] rounded-full px-4 py-2 border border-gray-100 focus-within:border-[#FF6B6B] focus-within:ring-1 focus-within:ring-[#FF6B6B]/30 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                placeholder="Hỏi gì đi sen ơi..."
                className="flex-1 bg-transparent outline-none text-sm text-[#5A3E2B] placeholder-gray-400"
              />
              <button 
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className="text-[#FF6B6B] hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="text-[10px] text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
                Powered by Petopia AI <Sparkles size={8} />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}