import axiosInstance from "@/lib/utils/axios";
import { User } from "@/types/User";


export interface Address {
  addressId?: string; 
  street: string;
  ward: string | null;
  district: string | null;
  province: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserUpdateDTO {
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  file?: File;
}

export const UserService = {
  
  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get("/users/me");
    console.log(response.data)
    return response.data.data;
  },

updateProfile: async (data: UserUpdateDTO): Promise<User> => {
    const formData = new FormData();
    
    if (data.fullName) formData.append("fullName", data.fullName);
    if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
    
    if (data.file) {
      formData.append("file", data.file); 
    }
    
    const response = await axiosInstance.put("/users/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(response.data)
    return response.data.data;
},

  getMyAddresses: async (): Promise<Address[]> => {
    const response = await axiosInstance.get("/users/addresses");
    return response.data.data;
  },

  addAddress: async (data: Address): Promise<Address> => {
    const response = await axiosInstance.post("/users/addresses", data);
    return response.data.data;
  },

  
  updateAddress: async (data: Address): Promise<Address> => {
    const { addressId, ...body } = data;
    const response = await axiosInstance.put(`/users/addresses/${addressId}`, body);
    return response.data.data;
  },

  
  deleteAddress: async (addressId: string): Promise<void> => {
    await axiosInstance.delete(`/users/addresses/${addressId}`);
  },
  
  
  setDefaultAddress: async (addressId: string): Promise<void> => {
      await axiosInstance.put(`/users/addresses/${addressId}/default`);
  }
};