

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}



export interface User {
  userId: string;             
  username: string;           
  email: string;              
  fullName: string;           
  phoneNumber: string;        
  role: UserRole;             
  loyaltyPoints: number;      
  isActive: boolean;          
  createdAt: string;          
  updatedAt: string;          
}



export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  
  setAuth: (user: User, accessToken: string) => void
  logout: () => void
}
export interface AuthResponse {
  username: string;           
  email: string;              
  fullName: string;           
  phoneNumber: string;
  password: string;
}