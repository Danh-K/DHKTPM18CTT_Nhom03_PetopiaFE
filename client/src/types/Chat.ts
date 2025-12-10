


export interface AiResponse {
  message: string;      
  actionType: "NONE" | "SHOW_PETS" | "SHOW_SERVICES" | "SHOW_ARTICLES" | "SHOW_VOUCHERS" | "SHOW_ORDER_STATUS";
  dataType: "pet" | "service" | "article" | "voucher" | "order" | null; 
  data: any;            
}


export interface ChatMessage {
  id: string;           
  sender: "user" | "bot";
  content: string;      
  
  
  actionType?: string;
  dataType?: string | null; 
  data?: any;
  timestamp: number;
}