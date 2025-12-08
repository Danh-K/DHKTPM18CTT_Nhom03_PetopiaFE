

import { Pet } from "./Pet"; 



export interface AiResponse {
  message: string;      
  actionType: "NONE" | "SHOW_PETS" | "SHOW_SERVICES" | "SHOW_ARTICLES" | "SHOW_VOUCHERS" | "SHOW_ORDER_STATUS";
  data: any;            
}


export interface ChatMessage {
  id: string;           
  sender: "user" | "bot";
  content: string;      
  
  
  actionType?: string;
  data?: any;
  timestamp: number;
}